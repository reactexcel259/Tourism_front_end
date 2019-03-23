import React from "react";
import StarRatings from "react-star-ratings";

export default function Review({ review }) {
  return (
    <div className="review">
      <div className="top">
        <div className="name">{review.name}</div>
        <StarRatings
          rating={5}
          // rating={this.state.rating}
          starRatedColor="#fbc000"
          // changeRating={this.changeRating}
          starDimension="0.8em"
          starSpacing="0px"
          numberOfStars={5}
          name="rating"
        />
      </div>
      <div className="text">{review.text}</div>
    </div>
  );
}
