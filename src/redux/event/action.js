import * as actions from "../actions";
import { call, put, select } from "redux-saga/effects";
import fireApi from "../../services/fireApi";
import { localStore } from "../../services/storage";
import { toast } from "react-toastify";

export function* getCategoriesRequest(action) {
  try {
    const response = yield call(fireApi, "GET", "getCategory");
    if (response) {
      yield put(actions.getCategoriesSuccess(response.data));
    } else {
      yield put(actions.getCategoriesError());
    }
  } catch (e) {
    yield put(actions.getCategoriesError());
  }
}

export function* getLocationsRequest(action) {
  try {
    const response = yield call(fireApi, "GET", "getLocations");
    if (response) {
      yield put(actions.getLocationsSuccess(response.data));
    } else {
      yield put(actions.getLocationsError());
    }
  } catch (e) {
    yield put(actions.getLocationsError());
  }
}

export function* getEventsByCategoryRequest(action) {
  try {
    const { page_number, id, ageFlag, eventState, eventCity } = action.payload;
    const response = yield call(
      fireApi,
      "GET",
      `events?categories=${id}&page=${page_number}${
        ageFlag === "all" ? "" : "&contentType=" + ageFlag
      }${eventState && "&EventState=" + eventState}${eventCity &&
        "&EventCity=" + eventCity}`
    );
    if (response) {
      yield put(
        actions.getEventsByCategorySuccess({
          page_number: page_number + 1,
          ...response.data
        })
      );
    } else {
      yield put(actions.getEventsByCategoryError());
    }
  } catch (e) {
    yield put(actions.getEventsByCategoryError());
  }
}

export function* getEventByIdRequest(action) {
  try {
    const response = yield call(fireApi, "GET", `getEvent/${action.payload}`);
    if (response) {
      yield put(actions.getEventByIdSuccess(response.data));
    } else {
      yield put(actions.getEventByIdError());
    }
  } catch (e) {
    yield put(actions.getEventByIdError());
  }
}

export function* addReviewRequest(action) {
  const header = {
    Authorization: localStore("token")
  };
  try {
    const response = yield call(
      fireApi,
      "POST",
      `events/addReview/${action.payload.event_id}`,
      action.payload.values,
      header
    );
    if (response) {
      toast.success("Your review posted successfully");
      yield put(actions.addReviewSuccess(response.data));
      yield put(actions.getEventByIdRequest(action.payload.event_id));
    } else {
      toast.error("Review");
      yield put(actions.addReviewError());
    }
  } catch (e) {
    yield put(actions.addReviewError());
  }
}

export function* addInterestRequest(action) {
  const header = {
    Authorization: localStore("token")
  };
  try {
    const response = yield call(
      fireApi,
      "PUT",
      `events/addInterest/${action.payload.id}`,
      null,
      header
    );
    if (response && response.data && response.data.success) {
      const userdata = yield select(state => state.auth.userdata.data);
      yield put(
        actions.addInterestSuccess({
          ...response.data,
          userdata,
          id: action.payload.id,
          pathname: action.payload.pathname
        })
      );
      // yield pit(actions.getInterestedEventsRequest())
      if (action.payload.pathname && action.payload.pathname.includes("event-detail")) {
        yield put(actions.getEventByIdRequest(action.payload.id));
      }
      // yield put(actions.getEventsByCategoryRequest(action.payload));
    } else {
      yield put(actions.addInterestError());
    }
  } catch (e) {
    yield put(actions.addInterestError());
  }
}

export function* addEventRequest(action) {
  try {
    const response = yield call(fireApi, "POST", `addEvent`, action.payload);
    if (response) {
      toast.success("Event Submitted");    
      yield put(actions.submitEventSuccess(response.data));
    } else {
      yield put(actions.submitEventError());
    }
  } catch (e) {
    yield put(actions.submitEventError());
  }
}
