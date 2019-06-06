import React from 'react'; 
import firebase from '../../firebase';
import {Grid, Form, Segment, Button, Header, Message, Image} from 'semantic-ui-react';
import  ifaLogo from '../../img/Logo-IFA-1.png';
import md5 from 'md5';
import { Link } from 'react-router-dom';

class Register extends React.Component {
    state = {
        pseudo: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users')
        // ici on liste les elements de notre state qui sont recup via les names des inputs
    };

    isFormValid = () => {
        /* ici on verifie en premier que le formulaire n'est pas vide avec isformempty(ce.state) 
        qui renvoie false si l'input est remplit true si il est vide si true  on remplit le tableau d'erreurs
        en modifiant le state errorrs*/
        let errors = [];
        let error; 

        if(this.isFormEmpty(this.state)){
            error = { message: 'Remplissez tous les champs !'};
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)){
            error = { message: 'Le mot de passe est invalide'}
            this.setState({ errors: errors.concat(error) });
            return false
        }
        else{

            return true;
        }
    }

    display

    isFormEmpty = ({pseudo, email, password, passwordConfirmation}) => {
        return !pseudo.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    isPasswordValid = ({password, passwordConfirmation}) => {
        if(password.length < 6 || passwordConfirmation < 6){
            return false;
        } else if (password !== passwordConfirmation){
            return false
        } else {
            return true;
        }
    }

    displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);

    handleChange = event => {
        this.setState({ [ event.target.name ]: event.target.value});
    }
    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid()){
            this.setState({ errors: [], loading: true})
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    createdUser.user.updateProfile({
                      displayName: this.state.pseudo,
                      photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                      //ici on genere un avatar avec md5 fonction de hachage qui permet de creer une empreinte numerique
                      // ici via l'email de l'user 
                    })
                    .then(() =>{
                        this.saveUser(createdUser).then(() => {
                        console.log('user saved');
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        this.setState({ errors: this.state.errors.concat(err), loading: false});
                    })
                    //this.setState({ loading: false });
                })
                .catch(err => {
                    console.error(err);
                    this.setState({ errors: this.state.errors.concat(err), loading: false });
                });
            }
    }

    saveUser = createdUser => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    }

    handleInputerror = (errors, inputName) =>{
       return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : "" 
    }
    render(){

        const { pseudo, email, password, passwordConfirmation, errors, loading } = this.state;

        return(
            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column style ={{ maxWidth: 450}}>
                    <Image src={ifaLogo} size='small' className="centered"/>
                    <Header as="h1" icon color="orange" textAlign="center">
                        S'enregistrer
                    </Header>
                    <Form onSubmit={this.handleSubmit} size="large">
                        <Segment stacked>
                            <Form.Input fluid name="pseudo" icon="user" iconPosition="left"
                            placeholder="Pseudo" onChange={this.handleChange} value={pseudo} type="text"/>
                            
                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                            placeholder="Email" onChange={this.handleChange} value={email} className={this.handleInputerror(errors, 'email')} type="email"/>
                            
                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                            placeholder="Mot de passe" onChange={this.handleChange} value={password} className={this.handleInputerror(errors, 'password')}  type="password"/>

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                            placeholder="Confirmation mot de passe" onChange={this.handleChange} value={passwordConfirmation} className={this.handleInputerror(errors, 'password')} type="password"/>

                            <Button disabled={loading} className={loading ? 'loading' : ""}color="orange" fluid size="large">Envoyer</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Erreur</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Déjà enregistré ? <Link to="/login">Se connecter</Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;