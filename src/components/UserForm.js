import React, { useState, useEffect } from 'react';
import { withFormik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

function UserForm({ values, errors, touched, status }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        status && setUsers(users => [...users, status])
    }, [status]);

    return (
        <div className='user-form'>
            <Form>
                <Field type='text' name='name' placeholder='Name' />
                {touched.name && errors.name && <p>{errors.name}</p>}
                <Field type='text' name='email' placeholder='Email' />
                {touched.email && errors.email && <p>{errors.email}</p>}
                <Field type='password' name='password' placeholder='Password' />
                {touched.password && errors.password && <p>{errors.password}</p>}
                <Field type='checkbox' name='terms' checked={values.terms}/>
                {touched.terms && errors.terms && <p>{errors.terms}</p>}
                <button type='submit'>Submit!</button>
            </Form>
            {users.map(user => (
                <div key={user.id}>
                    <h1>Name: {user.name}</h1>
                    <p>email: {user.email}</p>
                    <p>password: {user.password}</p>
                </div>
            ))}
        </div>
    )
}

const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, password, terms }) {
        return {
            name: name || '',
            email: email || '',
            password: password || '',
            terms: terms || false
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string()
            .max(10, 'Your name is too long! Try a nickname under 10 characters.')
            .required('Your name is required. We promise the government is not watching...'),
        email: Yup.string()
            .email('Not a valid email address. Check your spelling, poindexter.')
            .required('Your email address is required. Expect tons of spam.'),
        password: Yup.string()
            .min(6, 'Whoa buddy, that is not very secure. Make your password at least 6 characters long.')
            .required('A password is required. Please refrain from using your birthday.'),
        terms: Yup.bool()
            .oneOf([true], 'Must Accept Terms of Service')
    }),

    handleSubmit(values, { setStatus, resetForm}) {
        axios
            .post('https://reqres.in/api/users', values)
            .then(response => {
                console.log(response.data);
                setStatus(response.data);
                resetForm();
                
            })
            .catch(error => {
                console.log('Ya done goofed, kiddo.', error);
            })
    }

})(UserForm);

export default FormikUserForm;