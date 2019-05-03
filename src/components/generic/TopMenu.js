import React, { Component } from "react";
// import more from "../../images/more.svg";
// import search from "../../images/search.svg";
import mapMain from "../../images/map-main-color_g.svg";
import search from "../../images/icon/search.svg";
import { Link, withRouter } from "react-router-dom";
import "./TopMenu.scss";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
// import { geolocated } from "react-geolocated";
// import Geocode from "react-geocode";
import "./TopMenu.scss";

// Geocode.setApiKey("AIzaSyBB7Tc7njRoyjegBDmqAVj09AKWbdRrTCI");

class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_city: "",
      search_state: "",
      state: "",
      search_state_mobile: "",
      city: "",
      ageFlag: false,
      id: "",
      status: false,
      location_status: "",
      displayState: false,
      displayCity: false,
      displayAge: false,
      displayCal: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { filters } = this.props;
    if (this.props.places.data && this.props.categories.data) {
      if (
        filters.selectedCity !== prevProps.filters.selectedCity ||
        filters.selectedState !== prevProps.filters.selectedState ||
        !this.state.status
      ) {
        this.setState({ status: true });
        const oneCategory = this.props.categories.data.find(category => {
          return category.name === this.props.match.path.replace("/", "");
        });
        if (oneCategory) {
          if (!this.state.id) {
            this.setState({ id: oneCategory._id });
          }
          this.props.getEventsByCategoryRequest({
            sub_id: this.props.match.params.id && this.props.match.params.id,
            id: oneCategory && oneCategory._id,
            page_number: 1,
            ageFlag: filters.ageFlag,
            eventState: filters.selectedState,
            eventCity: filters.selectedCity
          });
        }
      }
    }
  }
  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    let states = [];
    states = [
      <li key={-1} onClick={() => this.props.stateChange("")}>
        All Locations
      </li>
    ];
    const cities = [];
    const more_cities = [];
    const more_states = [];
    let stateData = "";
    let selected_city = "";

    if (this.props.places.data) {
      stateData = this.props.places.data.find(
        state => this.props.filters.selectedState === state._id
      );
      this.props.places.data.map((state, i) => {
        if (
          state.name
            .toLowerCase()
            .includes(this.state.search_state.toLowerCase())
        ) {
          states.push(
            <li key={i} onClick={() => this.props.stateChange(state._id)}>
              {state.name}
            </li>
          );
        }
      });
      if (stateData) {
        stateData.cities.map((city, index) => {
          if (this.props.filters.selectedCity === city._id) {
            selected_city = city;
          } else {
            if (index < 3) {
              cities.push(
                <li
                  key={index}
                  style={{
                    fontWeight:
                      this.props.filters.selectedCity === city._id
                        ? "700"
                        : "600"
                  }}
                  onClick={() => this.props.cityChange(city._id)}
                >
                  {city.name}
                </li>
              );
            } else {
              more_cities.push(city);
            }
          }
        });
      }
    }

    const state_place = () => {
      if (this.props.places.data && this.props.filters.selectedState) {
        const state_info = this.props.places.data.find(
          state => this.props.filters.selectedState === state._id
        ).name;
        return state_info;
      }
      return "All Locations";
    };

    return (
      <div className="">
        <div className="col-12 top-menu">
          <div className="menu-links">
            <div className="menu-links-left">
              <span className="more-options-btn">
                <img src={mapMain} />
                <span className="text">{state_place()}</span>
                <div className="more-options-state">
                  <ul>{states}</ul>
                </div>
              </span>
              <span className="text">{selected_city.name}</span>
              <span>
                <ul className="some-cities">{cities}</ul>
              </span>

              <span className="more-options-btn more-options-btn-cities">
                {more_cities.length ? (
                  <>
                    <span className="text">more ...</span>
                    <div className="more-options">
                      <ul>
                        {more_cities
                          .filter(city =>
                            city.name
                              .toLowerCase()
                              .includes(this.state.search_city.toLowerCase())
                          )
                          .map((city, index) => (
                            <li
                              key={index}
                              onClick={() => this.props.cityChange(city._id)}
                            >
                              {city.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </>
                ) : null}

                {/* <span>
                  <ul className="some-cities" style={{ display: "none" }}>
                    {selected_city && (
                      <li className="active">{selected_city.name}</li>
                    )}
                    {cities}
                  </ul>
                </span> */}
              </span>
            </div>
            <div className="mobile-menu-links">
              {/* <div className="menu-links-left"> */}
              <div
                className="state-list"
                //   onClick={e => {
                //     e.stopPropagation();
                //     this.refs.cityList.style.display = "none";
                //     this.refs.ageList.style.display = "none";
                //     this.refs.viewList.style.display = "none";
                //     this.refs.stateList.style.display = "block";
                //   }}
              >
                {/* <img src={mapMain} /> */}
                {this.props.places.data && this.props.filters.selectedState
                  ? this.props.places.data.find(
                      state => this.props.filters.selectedState === state._id
                    ).name
                  : null}
                <ul
                  ref="stateList"
                  // value={this.props.filters.selectedState}
                  // onChange={e => this.props.stateChange(e.target.value)}
                >
                  <li
                  //   onClick={e => {
                  //     e.stopPropagation();
                  //     e.preventDefault();
                  //     this.refs.stateList.style.display = "none";
                  //   }}
                  >
                    x
                  </li>
                  {this.props.places.data &&
                    this.props.places.data.map((state, i) => (
                      <li
                        className="active"
                        key={i}
                        value={state._id}
                        onClick={() => this.props.stateChange(state._id)}
                      >
                        {state.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  places: state.event.locations.data,
  categories: state.event.categories.data,
  page_details: state.event.eventsByCategory.data,
  events: state.event.eventsByCategory.events,
  page_number: state.event.eventsByCategory.page_number,
  successFlag: state.event.eventsByCategory.isSuccess,
  filters: state.event
});

const mapDispatchToProps = dispatch => ({
  getEventsByCategoryRequest: data =>
    dispatch(actions.getEventsByCategoryRequest(data)),
  //   getMonthlyEventsRequest: data =>
  //     dispatch(actions.getMonthlyEventsRequest(data)),
  stateChange: id => dispatch(actions.stateChange(id)),
  cityChange: id => dispatch(actions.cityChange(id))
  //   setStorableLocation: value => dispatch(actions.storableLocation(value))
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TopMenu)
);
