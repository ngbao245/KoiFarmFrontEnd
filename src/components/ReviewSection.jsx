import React, { useState, useEffect } from "react";
import { getReviewsByItem, createReview } from "../services/ReviewService";
import { getUserById } from "../services/UserService";
import { toast } from "react-toastify";
import StarRatings from "react-star-ratings";
import "./ReviewSection.css"

const Reviews = ({ productItemId }) => {
    const [reviews, setReviews] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await getReviewsByItem(productItemId);
                const reviewsData = response.data || [];

                setReviews(reviewsData);

                const userIds = [...new Set(reviewsData.map((review) => review.userId))];
                const userNamePromises = userIds.map(async (userId) => {
                    try {
                        const userResponse = await getUserById(userId);
                        return { userId, name: userResponse.data.name || "Anonymous" };
                    } catch {
                        return { userId, name: "Anonymous" };
                    }
                });

                const userNameResults = await Promise.all(userNamePromises);
                const userNameMap = userNameResults.reduce((map, { userId, name }) => {
                    map[userId] = name;
                    return map;
                }, {});
                setUserNames(userNameMap);

                setLoading(false);
            } catch (error) {
                // toast.error("Error fetching reviews.");
                console.error("Error fetching reviews.");
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productItemId]);

    const handleReviewSubmit = async () => {
        if (!rating || !description) {
            toast.error("Please fill out all fields.");
            return;
        }

        try {
            const reviewData = {
                rating,
                description,
                productItemId,
            };
            const response = await createReview(reviewData);

            if (response.statusCode === 200 || response.statusCode === 201) {
                toast.success("Review submitted!");

                const newReview = {
                    id: response.data.id,
                    rating,
                    description,
                    userId: response.data.userId,
                };

                setReviews((prevReviews = []) => {
                    return [...(Array.isArray(prevReviews) ? prevReviews : []), newReview];
                });

                setUserNames((prevUserNames) => ({
                    ...prevUserNames,
                    [response.data.userId]: userNames[response.data.userId]
                }));

                setDescription("");
                setRating(0);
            } else {
                // throw new Error(`Error: ${response.statusText}`);
                toast.error("You need to log in to submit a review.");
            }
        } catch (error) {
            if (error.response && error.response.statusCode === 401) {
                toast.error("You need to log in to submit a review.");
            } else {
                toast.error("Error submitting review.");
                console.error("Error submitting review.");
            }
        }
    };

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    return (
        <div className="review-section">
            <h3>Đánh giá của khách hàng</h3>
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <p style={{
                                    marginTop: 20
                                }}>Khách hàng:</p>
                                <strong style={{
                                    marginTop: 5,
                                }}>{userNames[review.userId]}</strong>
                                <StarRatings
                                    rating={review.rating}
                                    starRatedColor="yellow"
                                    starDimension="20px"
                                    starSpacing="5px"
                                    numberOfStars={5}
                                    name="rating"
                                />
                            </div>
                        </div>
                        <p>Bình luận: {review.description}</p>
                    </div>
                ))
            ) : (
                <p>Chưa có đánh giá nào.</p>
            )}

            {/* Form for submitting a new review */}
            <div className="review-form">
                <h4>Hãy để lại đánh giá</h4>
                <div className="rating-input">
                    <label style={{
                        paddingTop: 15,
                        paddingRight: 10
                    }}>Sao đánh giá :</label>
                    <StarRatings
                        rating={rating}
                        changeRating={(newRating) => setRating(newRating)}
                        starRatedColor="blue"
                        numberOfStars={5}
                        name="rating"
                    />
                </div>
                <div className="description-input">
                    <label>Bình luận:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        placeholder="Hãy viết đánh giá của bạn ở đây..."
                    />
                </div>
                <button className="btn btn-primary" onClick={handleReviewSubmit}>
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default Reviews;
