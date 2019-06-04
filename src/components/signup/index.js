import React, { Component } from "react";
// import logo from "../../images/logo_transparent.png";
// import fbWhite from "../../images/fb-white.svg";
// import whiteCross from "../../images/cross-white.svg";
import * as actions from "../../redux/actions";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import FacebookLogin from "react-facebook-login";
import Loader from "react-loader-spinner";
import { withRouter, Link } from "react-router-dom";
import l_img from "../../images/l_img.png";
import login_r_img from "../../images/login_r_img.png";
import Block1 from "../generic/Block1";

class SignUp extends Component {
  render() {
    return (
      <>
        <div className="fb-btn">
          <FacebookLogin
            appId="2194646720630049"
            autoLoad={true}
            fields="name,email,picture"
            callback={this.props.responseFacebook}
            textButton="Register with Facebook"
            icon="fa-facebook"
          />
        </div>
        <div className="row or-section">
          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 col-5 hr-line-section">
            <div className="hr-line" />
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 col-2">
            <div className="or-text">or</div>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 col-5 hr-line-section">
            <div className="hr-line" />
          </div>
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            name: "",
            email: "",
            password: "",
            password_confirm: "",
            receiveEmails: true
          }}
          validate={values => {
            let errors = {};
            if (!values.name) {
              errors.name = "Required";
            }
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (!values.password) {
              errors.password = "Required";
            } else {
              if (!values.password_confirm) {
                errors.password_confirm = "Required";
              } else if (values.password !== values.password_confirm) {
                errors.password_confirm = "Passwords donot match";
              }
            }
            return errors;
          }}
          onSubmit={(values, actions) => {
            this.props.signupRequest(values);
          }}
          render={({
            values,
            errors,
            status,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting
          }) => (
            <Form>
              <div className="input-fields">
                <label>Full Name</label>
                <div>
                  <input
                    name="name"
                    value={values.name}
                    type="text"
                    placeholder=""
                    onChange={handleChange}
                  />
                  {errors.name && touched.name && (
                    <label className="error">{errors.name}</label>
                  )}
                </div>
              </div>
              <div className="input-fields">
                <label>Email</label>
                <div>
                  <input
                    name="email"
                    type="email"
                    value={values.email}
                    placeholder=""
                    onChange={handleChange}
                  />
                  {errors.email && touched.email && (
                    <label className="error">{errors.email}</label>
                  )}
                </div>
              </div>
              <div className="input-fields">
                <label>Password</label>
                <div>
                  <input
                    name="password"
                    type="password"
                    value={values.password}
                    placeholder=""
                    onChange={handleChange}
                  />
                  {errors.password && touched.password && (
                    <label className="error">{errors.password}</label>
                  )}
                </div>
              </div>
              <div className="input-fields">
                <label>Re-type Password</label>
                <div>
                  <input
                    name="password_confirm"
                    type="password"
                    value={values.password_confirm}
                    placeholder=""
                    onChange={handleChange}
                  />
                  {errors.password_confirm && touched.password_confirm && (
                    <label className="error">{errors.password_confirm}</label>
                  )}
                </div>
              </div>
              <div className="remember-me" style={{ display: "flex" }}>
                <input
                  type="checkbox"
                  id="receiveEmails"
                  name="receiveEmails"
                  value="receiveEmails Emails"
                  checked={values.receiveEmails}
                  onChange={handleChange}
                />
                <label htmlFor="receiveEmails" className="remember-text">
                  Yes, I want to receive Shopping in Jamaica emails
                </label>
              </div>
              <div className="register-btn">
                <button type="submit">
                  {this.props.signup.isLoading ? (
                    <div className="loader-div">
                      <Loader type="Oval" color="#fff" height="20" width="20" />
                    </div>
                  ) : (
                    "REGISTER"
                  )}
                </button>
              </div>
              <div className="term-policy">
                <span>
                  By registering you accept our{" "}
                  <span className="term-color">Terms</span> and{" "}
                  <span className="term-color">Pivacy Policy</span>
                </span>
              </div>
            </Form>
          )}
        />
      </>
    );
  }
}

const mapStateToProps = state => ({
  signup: state.auth.signup
});

const mapDispatchToProps = dispatch => ({
  signupRequest: data => dispatch(actions.signupRequest(data))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignUp)
);
