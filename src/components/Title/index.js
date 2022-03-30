import React from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Flex } from 'rebass'
import { RowFixed } from '../Row'

const TitleWrapper = styled.div`
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }

  z-index: 10;
`

export default function Title() {
  const { push } = useRouter();

  return (
    <TitleWrapper onClick={() => push('/')}>
      <Flex alignItems="center">
        <RowFixed>
          <img width="125px" style={{ marginLeft: '8px', marginTop: '0px' }} src="/voltage-wordmark.svg" alt={process.env.NEXT_PUBLIC_APP_NAME || "logo"} />
        </RowFixed>
      </Flex>
    </TitleWrapper>
  )
}
