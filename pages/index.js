import React, {Component} from 'react';
import {Message, Form, Input, Card, Button} from 'semantic-ui-react';
import {Link} from '../routes';
import Layout from '../components/Layout';
import web3 from '../ethereum/web3';

class ArticleIndex extends Component {
  state = {
    queryTxHash: '',
    rawHex: 'Text will go here',
    content: '',
    loading: false,
    errorMessage: '',
    isAscii: true,
    isUtf8: false,
  };
  onSubmit = async event => {
    event.preventDefault();
    this.setState({loading: true, errorMessage: ''});
    try {
      const transaction = await web3.eth.getTransaction(this.state.queryTxHash);
      console.log('tx:', transaction);
      this.setState({rawHex: transaction.input});
      if (this.state.isAscii) {
        this.convertToAscii();
      } else {
        this.convertToUtf8();
      }
    } catch (err) {
      this.setState({errorMessage: err.message});
    }
    this.setState({loading: false});
  };
  toggleAscii = event => {
    event.preventDefault();
    this.convertToAscii();
  };
  toggleUtf8 = event => {
    event.preventDefault();
    this.convertToUtf8();
  };
  convertToAscii = () => {
    this.setState({
      isAscii: true,
      isUtf8: false,
      content: web3.utils.hexToAscii(this.state.rawHex),
    });
  };
  convertToUtf8 = () => {
    this.setState({
      isAscii: false,
      isUtf8: true,
      content: web3.utils.hexToUtf8(this.state.rawHex),
    });
  };
  render() {
    console.log(this.props.transaction);
    return (
      <Layout>
        <h3>Ethereum Themis (Must login Metamask)</h3>
        <Form onSubmit={this.onSubmit}>
          <Form.Field>
            <label>
              Submit a HashTx (Must login metamask first)
              (e.g. sad story: 0xb1ed364e4333aae1da4a901d5231244ba6a35f9421d4607f7cb90d60bf45578a)
            </label>
            <Input
              label="HashTx:"
              labelPosition="left"
              value={this.state.queryTxHash}
              onChange={event =>
                this.setState({queryTxHash: event.target.value})
              }
            />
          </Form.Field>
          <Message error header="Ooops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Send!
          </Button>
        </Form>

        <br />

        <Button.Group>
          <Button color="olive" onClick={this.toggleAscii}>
            ASCII
          </Button>
          <Button.Or />
          <Button color="yellow" onClick={this.toggleUtf8}>
            Utf-8
          </Button>
        </Button.Group>
        <Card fluid>
          <Card.Content>
            <Card.Header>Content</Card.Header>
            <Card.Meta>{this.state.isAscii ? "ASCII" : "Utf-8"}</Card.Meta>
            <Card.Description content={this.state.content} />
          </Card.Content>
        </Card>
      </Layout>
    );
  }
}

export default ArticleIndex;
