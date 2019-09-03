import * as React from 'react'
import styled from 'styled-components'

import { Input } from '@/webapp/input'

const Wrapper = styled.div`
  font-size: 24px;
`

interface Props {}  // eslint-disable-line @typescript-eslint/no-empty-interface

interface State {
  wordlistId: string
  word: string
  desc: string
  words: Array<{
    word: string
    desc: string
  }>
}

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      wordlistId: 'English',
      word: '',
      desc: '',
      words: [],
    }
  }

  componentDidMount() {
    this.updateWords().then()
  }

  public async updateWords() {
    const { wordlistId } = this.state
    const fetched = await fetch(`/words?wordlistId=${wordlistId}`)
    const words = await fetched.json()
    this.setState({
      words,
    })
  }

  public render() {
    const { wordlistId, word, desc, words } = this.state

    return (
      <Wrapper>
        <h1>Wordlist</h1>
        <div>
          <h2>Add Word</h2>
          <Input
            title='Wordlist ID'
            value={wordlistId}
            onChange={value => {
              this.setState({
                wordlistId: value,
              }, this.updateWords)
            }}
          />
          <Input
            title='Word'
            value={word}
            onChange={value => this.setState({ word: value })}
          />
          <Input
            title='Description'
            value={desc}
            onChange={value => this.setState({ desc: value })}
          />
          <button
            onClick={async () => {
              if (desc && word && wordlistId) {
                this.setState({
                  word: '',
                  desc: '',
                })

                await fetch(`/word`, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  method: 'POST',
                  body: JSON.stringify({
                    desc,
                    word,
                    wordlistId,
                  }),
                })

                await this.updateWords()
              }
            }}
          >
            Add a word to wordlist
          </button>
        </div>
        <div>
          <h2>Words</h2>
          <div>
            {words.map(word => (
              <div key={word.word}>
                <span>{word.word}</span>: <span>{word.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    )
  }
}
