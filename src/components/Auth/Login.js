import React from 'react'; 
import firebase from '../../firebase';
import {Grid, Form, Segment, Button, Header, Message, Image} from 'semantic-ui-react';
import  ifaLogo from '../../img/Logo-IFA-1.png';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    state = {
        email: "",
        password: "",
        errors: [],
        loading: false,
        // ici on liste les elements de notre state qui sont recup via les names des inputs
    };

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = event => {
        this.setState({ [ event.target.name ]: event.target.value});
    }
    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.setState({ errors: [], loading: true});
            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then(signInUser => {
                    console.log(signInUser);
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                })
            }
    }

    isFormValid = ({email, password}) => email && password;
    handleInputerror = (errors, inputName) =>{
       return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : "" 
    }
    render(){

        const {email, password, errors, loading } = this.state;

        return(
            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column style ={{ maxWidth: 450}}>
                    <Image src={ifaLogo} size='small' className="centered"/>
                    <Header as="h1" icon color="orange" textAlign="center">
                        Se connecter
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>  
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Email" onChange={this.handleChange} value={email} className={this.handleInputerror(errors, 'email')} type="email"/>
                            
                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                            placeholder="Mot de passe" onChange={this.handleChange} value={password} className={this.handleInputerror(errors, 'password')}  type="password"/>


                            <Button disabled={loading} className={loading ? 'loading' : ""}color="orange" fluid size="large">Envoyer</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Erreur</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Nouveau ? <Link to="/login">S'enregistrer</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login;