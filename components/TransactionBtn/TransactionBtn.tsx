import { Select } from '@components/Select';
import { colors } from '@data/config';
import styled from '@emotion/styled';
import { OpenSeaFungibleToken } from '@interfaces/services/openSeaTypes';
import { convertToUsd, formatDate, getDuration } from '@utils/index';
import { getPriceString } from '@utils/getPriceString';
import get from 'lodash/get';
import React, { useEffect, useMemo, useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi';
import { width } from '@mui/system';
import { useOreId, useUser } from 'oreid-react';
import { AuthProvider } from 'oreid-js';

interface Props {}

export const TransactionBtn = ({}: Props) => {
  const userFromUseUser = useUser();
  const oreidFromUseOreId = useOreId();

  const onClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    console.log('Before userFromUseUser: ', userFromUseUser);
    // if you call this function before login, you will get an error
    // console.log('Oreid object: ', oreidFromUseOreId.auth.user.data);
    if (!userFromUseUser) {
      await oreidFromUseOreId.popup.auth({ provider: AuthProvider.Google });
    }
    // the "userFromUseUser" variable will be updated with the user data, but just in next render
    console.log('After userFromUseUser: ', userFromUseUser);
    // the data insede "oreId" instance, will have the current "user.data"
    // just use this, after the login... but is better to use the "useUser" hook when is possible
    console.log('Oreid object: ', oreidFromUseOreId.auth.user.data);

    // get user eth chain account (A user can have multiple accounts in different chains)
    // I gess a user also can have multiple accounts in the same chain, but I don't if it is possible (check which Tray)
    // PS: here we are using data from "oreId" instance, because the "userFromUseUser" variable is not updated yet.
    const ethAccount = oreidFromUseOreId.auth.user.data.chainAccounts.find((ca) => ca.chainNetwork === 'eth_goerli');

    // Create a oreId transaction
    const transaction = await oreidFromUseOreId.createTransaction({
      transaction: {
        from: ethAccount?.chainAccount!,
        to: '0x60d5DA4FC785Dd1dA9c2dAF084B2D5ba478c8f8b',
        value: '0x02',
        gasPrice: '0x1A4A6',
        gasLimit: '0x6274'
      },

      chainAccount: ethAccount?.chainAccount,
      chainNetwork: ethAccount?.chainNetwork,

      signOptions: {
        broadcast: false,
        signatureOnly: true,
        returnSignedTransaction: true
      }
    });

    const signResponse = await oreidFromUseOreId.popup.sign({ transaction });

    console.log({ signResponse });
  };
  return (
    <>
      <button
        style={{
          backgroundColor: '#cd0d0d',
          color: '#ffffff',
          borderRadius: '4px',
          height: '31px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          fontSize: '12px',
          lineHeight: '32px',
          fontWeight: 'bold',
          textAlign: 'center',
          transition: 'all 0.3s ease 0s',
          width: '200px',
          margin: '0 auto'
        }}
        onClick={onClick}>
        Transaction
      </button>
    </>
  );
};
