import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-size: 24px;
`

export class App extends React.Component {
  public render() {
    return (
      <Wrapper>
        <h1>Hello!</h1>
      </Wrapper>
    )
  }
}
