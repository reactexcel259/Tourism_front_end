import React, { Component } from "react";
import event_details_lb from "../../images/event_details_lb.svg";
import phone_icon from "../../images/icon/phone.svg";
import location_icon from "../../images/icon/location.svg";
import email_icon from "../../images/icon/email.svg";
import heart_icon from "../../images/heart.svg";
import heart_full_icon from "../../images/heart-full.svg";
import time_icon from "../../images/icon/-e-ic_time.svg";
import StarRatings from "react-star-ratings";
import Review from "../generic/Review";
import EventSubDetail from "../generic/EventSubDetail";
import { relative } from "path";
import { ReactComponent as TwitterIcon } from "../../images/icon/twitter.svg";
import { ReactComponent as ThumbsupIcon } from "../../images/icon/thumbs-up.svg";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { Formik, Form } from "formik";
import { localStore } from "../../services/storage";
import ReactFBLike from "react-fb-like";
import { FacebookProvider, Like } from "react-facebook";
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton
} from "react-share";
// import { ReactComponent as Test } from "../../images/event_details_lb.svg";
import "./event-details.scss";
class Index extends Component {
  state = {
    leave_review: false
  };
  constructor(props) {
    super(props);
    if (props.match.params.id) {
      props.getEventById(props.match.params.id);
    }

    // window.location.reload();
    // FB.XFBML.parse();
  }
  // componentDidMount(){
  //   if(this.props.location.pathname.includes('event-details') ){
  //     window.location.reload();
  //   }
  // }
  render() {
    const { categories, event: data, userdata } = this.props;
    const event_sub_details = data
      ? [
          { image: location_icon, text: data.EventPlace },
          { image: phone_icon, text: "phone number" },
          { image: email_icon, text: "email" },
          { image: time_icon, text: "account" }
        ]
      : null;
    let avgRate,
      sum = 0;
    if (data) {
      data.reviews.forEach(m => (sum += parseInt(m.stars)));
      avgRate = sum / data.reviews.length;
      if (data.reviews.length == 0) {
        avgRate = 0;
      }
    }
    let youInterested;
    if (data && userdata && userdata.data) {
      youInterested = data.interested.find(oneInterested => {
        return oneInterested._id == userdata.data._id;
      });
    }
    return (
      <div className="event-details row">
        {/* <ReactFBLike language="en_US" appId="717589285046812" version="v2.12"  share="" showFaces="" width=""/> */}
        {/* <FacebookProvider appId="2194646720630049">
          <Like
            href="http://www.facebook.com"
            colorScheme="dark"
            text={false}
          />
        </FacebookProvider> */}

        {data && data.title ? (
          <>
            <div
              className="col-md-6 col-12 p-0 event-image"
              style={{
                backgroundImage: `url(${data.image.secure_url})`,
                minHeight: "350px"
              }}
            />
            <div className="col-md-6 col-12 p-3 right">
              <div>
                <div className="block">
                  <img className="category-icon" src={categories[0].image} />
                  <div className="title">{data.title}</div>
                </div>
                <div className="block">
                  <StarRatings
                    rating={avgRate}
                    // rating={this.state.rating}
                    starRatedColor="#fbc000"
                    // changeRating={this.changeRating}
                    starDimension="0.8em"
                    starSpacing="0px"
                    numberOfStars={5}
                    name="rating"
                  />
                  <div className="rating-text">
                    {data.reviews.length} reviews
                  </div>
                </div>
                <div className="block">
                  <div className="desc">{data.content.brief}</div>
                </div>
              </div>
              <div className="block sub-details">
                {event_sub_details.map((info, i) => (
                  <EventSubDetail key={i} {...info} />
                ))}
              </div>
              <div className="block social-buttons mt-3">
                <button
                  className="btn btn-primary favorites-btn"
                  onClick={() => {
                    if (localStore("token")) {
                      this.props.addInterestRequest({
                        id: data._id,
                        pathname: this.props.location.pathname
                      });
                    } else {
                      this.props.history.push("/auth/");
                    }
                  }}
                  title={localStore("token") ? "" : "Login first"}
                >
                  <img
                    src={data && youInterested ? heart_full_icon : heart_icon}
                  />
                  Add to Favorites
                </button>
                <div className="social d-flex">
                  {/* <button className="btn btn-primary px-1 py-0 d-flex">
                    <ThumbsupIcon />
                    <div className="text">like</div>
                  </button> */}
                  <div
                    className="fb-like"
                    data-href={
                      data.facebookUrl
                        ? data.facebookUrl
                        : "https://facebook.com/"
                    }
                    data-layout="button_count"
                    data-action="like"
                    data-size="large"
                    data-show-faces="false"
                    data-share="false"
                  />
                  {/* <button className="btn btn-primary ml-1 px-1 py-0 d-flex tweet"> */}
                  {/* <div className="text">Tweet</div> */}
                  {/* </button> */}
                  <TwitterShareButton
                    className="btn btn-primary ml-1 px-1 py-0 d-flex tweet"
                    url={`${window.location.origin}/#/event-detail/${data._id}`}
                    title=""
                    style={{ height: "28px", alignItems: "center" }}
                  >
                    <TwitterIcon width="15px" height="15px" />
                    <div
                      className="text"
                      style={{ marginLeft: "5px", fontSize: "12px" }}
                    >
                      Tweet
                    </div>
                  </TwitterShareButton>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 p-0 left">
              <div
                style={{
                  width: "100%",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <img
                  style={{ transform: "scale(1.24)" }}
                  src={event_details_lb}
                />
                <div className="timings">
                  <div className="small-title">Open Hours</div>
                  <div className="timing">
                    {[
                      {
                        day: "Monday",
                        time: data.monStartTime + "-" + data.monEndTime
                      },
                      {
                        day: "Tuesday",
                        time: data.tueStartTime + "-" + data.tueEndTime
                      },
                      {
                        day: "Wednesday",
                        time: data.wedStartTime + "-" + data.wedEndTime
                      },
                      {
                        day: "Thursday",
                        time: data.thrStartTime + "-" + data.thrEndTime
                      },
                      {
                        day: "Friday",
                        time: data.friStartTime + "-" + data.friEndTime
                      },
                      {
                        day: "Saturday",
                        time: data.satStartTime + "-" + data.satEndTime
                      },
                      {
                        day: "Sunday",
                        time: data.sunStartTime + "-" + data.sunEndTime
                      }
                    ].map((element, i) => (
                      <div key={i} className="day-block">
                        <div className="day">{element.day}</div>
                        <div className="time">
                          {element.time && element.time != "-"
                            ? element.time
                            : "Closed"}
                        </div>
                      </div>
                    ))}
                    <div />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12 p-3 review-block">
              <div className="small-title">Reviews</div>
              {data.reviews.length ? (
                <div className="reviews">
                  {userdata.data &&
                  data.reviews.find(review => {
                    return review.user_id._id == userdata.data._id;
                  }) ? (
                    <>
                      {data.reviews
                        .filter(review => {
                          return review.user_id._id == userdata.data._id;
                        })
                        .map((review, i) => (
                          <Review key={i} review={review} />
                        ))}
                      {data.reviews
                        .filter(review => {
                          return review.user_id._id != userdata.data._id;
                        })
                        .map(
                          (review, i) =>
                            i < 2 && <Review key={i} review={review} />
                        )}
                    </>
                  ) : (
                    data.reviews.map(
                      (review, i) => i < 3 && <Review key={i} review={review} />
                    )
                  )}
                </div>
              ) : (
                <div className="reviews">Be the first to add review.</div>
              )}
              {localStore("token") &&
              userdata.data &&
              data.reviews.find(review => {
                return review.user_id._id == userdata.data._id;
              }) ? null : (
                <div className="leave-review">
                  {this.state.leave_review ? (
                    <div>
                      <Formik
                        initialValues={{
                          comment: "",
                          stars: 0
                        }}
                        validate={values => {
                          let errors = {};
                          if (!values.comment) {
                            errors.comment = "Required";
                          }
                          if (!values.stars || values.stars == 0) {
                            errors.stars = "Required";
                          }
                          return errors;
                        }}
                        onSubmit={(values, actions) => {
                          this.props.addReviewRequest({
                            values,
                            event_id: data._id
                          });
                        }}
                        render={({
                          values,
                          errors,
                          status,
                          touched,
                          handleBlur,
                          handleChange,
                          handleSubmit,
                          isSubmitting,
                          setFieldValue
                        }) => (
                          <Form>
                            <div className="input-fields">
                              <div>
                                <textarea
                                  name="comment"
                                  value={values.text}
                                  onChange={handleChange}
                                />
                                {errors.comment && touched.comment && (
                                  <label className="error">
                                    {errors.comment}
                                  </label>
                                )}
                              </div>
                              <div>
                                <StarRatings
                                  rating={values.stars}
                                  // rating={this.state.rating}
                                  starRatedColor="#fbc000"
                                  changeRating={value =>
                                    setFieldValue("stars", value)
                                  }
                                  starDimension="2em"
                                  starSpacing="0px"
                                  numberOfStars={5}
                                  name="stars"
                                />
                                {errors.stars && touched.stars && (
                                  <label className="error">
                                    {errors.stars}
                                  </label>
                                )}
                              </div>
                              <div>
                                <button
                                  className="blue-button"
                                  onClick={() =>
                                    this.setState({ leave_review: false })
                                  }
                                >
                                  Cancel
                                </button>
                                <button
                                  className="blue-button ml-2"
                                  type="submit"
                                >
                                  Add Review
                                </button>
                              </div>
                            </div>
                          </Form>
                        )}
                      />
                    </div>
                  ) : (
                    <div
                      className="leave-review"
                      title={!localStore("token") && "Login First"}
                      onClick={() => {
                        if (localStore("token")) {
                          this.setState({ leave_review: true });
                        } else {
                          this.props.history.push("/auth/");
                        }
                      }}
                    >
                      Leave Review
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  event: state.event.eventById.data.data,
  userdata: state.auth.userdata.data
});

const mapDispatchToProps = dispatch => ({
  getEventById: data => dispatch(actions.getEventByIdRequest(data)),
  addReviewRequest: data => dispatch(actions.addReviewRequest(data)),
  addInterestRequest: data => dispatch(actions.addInterestRequest(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
