import * as React from 'react'

interface Props {
  title: string
  value: string
  onChange(value: string): void
}

interface State {
  value: string
}

export class Input extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  render() {
    const { title, value, onChange } = this.props

    return (
      <div>
        {title}
        <input
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
        />
      </div>
    )
  }
}
