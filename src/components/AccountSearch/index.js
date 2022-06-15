import React, { useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import {
  Button,
  makeStyles,
  styled as muiStyled,
  TextField,
} from "@material-ui/core";

import { AutoRow } from "../Row";

const isAddress = (value) => {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch (e) {
    return false;
  }
};

const Input = muiStyled(TextField)(`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  padding: 12px 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg1};
  font-size: 16px;
  margin-right: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`);

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(0, 1),
  }
}));

function AccountSearch() {
  const classes = useStyles();
  
  const [accountValue, setAccountValue] = useState();
  const router = useRouter();

  function handleAccountSearch() {
    if (isAddress(accountValue)) {
      router.push("/users/" + accountValue);
    }
  }

  return (
    <AutoRow spacing={1}>
      <Input
        fullWidth
        variant="outlined"
        placeholder="0x..."
        onChange={(e) => {
          setAccountValue(e.target.value);
        }}
      />
      <Button variant="outlined" className={classes.button} onClick={handleAccountSearch}>Load Account</Button>
    </AutoRow>
  );
}

export default AccountSearch;
