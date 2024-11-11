import React, { useState, useEffect } from "react";
import { getReviewsByItem, createReview, deleteReview, updateReview } from "../services/ReviewService";
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

    const [isEditing, setIsEditing] = useState(false);
    const [editReviewId, setEditReviewId] = useState(null);

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

        const reviewData = {
            rating,
            description,
            productItemId,
        };

        try {
            if (isEditing) {
                // Update review if editing
                const response = await updateReview(editReviewId, reviewData);
                if (response.status === 403) {
                    toast.error("Bạn không phải là người viết review này!");
                } else {
                    toast.success("Review updated!");

                    setReviews((prevReviews) =>
                        prevReviews.map((review) =>
                            review.id === editReviewId ? { ...review, rating, description } : review
                        )
                    );
                }
                setIsEditing(false);
                setEditReviewId(null);
            } else {
                // Create new review if not editing
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

                    if (!userNames[newReview.userId]) {
                    try {
                        const userResponse = await getUserById(newReview.userId);
                        setUserNames((prevUserNames) => ({
                            ...prevUserNames,
                            [newReview.userId]: userResponse.data.name || "Anonymous"
                        }));
                    } catch {
                        setUserNames((prevUserNames) => ({
                            ...prevUserNames,
                            [newReview.userId]: "Anonymous"
                        }));
                    }
                }
                } else {
                    // throw new Error(`Error: ${response.statusText}`);
                    toast.error("You need to log in to submit a review.");
                }
            }

            setRating(0);
            setDescription("");
        } catch (error) {
            if (error.response && error.response.statusCode === 401) {
                toast.error("You need to log in to submit a review.");
            } else {
                toast.error(isEditing ? "Error updating review." : "Error submitting review.");
                console.error(isEditing ? "Error updating review." : "Error submitting review.");
            }
        }
    };

    const handleEditReview = (review) => {
        if (isEditing == false){
            setRating(review.rating);
            setDescription(review.description);
            setEditReviewId(review.id);
            setIsEditing(true);
        } else if (isEditing == true) {
            setRating(0);
            setDescription("");
            setEditReviewId("");
            setIsEditing(false);
        }
        
    };

    const handleDeleteReview = async (reviewId) => {
        const confirmed = window.confirm("Bạn có muốn xóa đánh giá này không?");
        if (!confirmed) return;

        try {
            const response = await deleteReview(reviewId);
            if (response.status === 403) {
                toast.error("Bạn không phải là người viết bài đánh giá này!");
            } else {
                setReviews(reviews.filter((review) => review.id !== reviewId));
                toast.success("Review deleted successfully!");
            }

        } catch (error) {
            toast.error("Error deleting review. Please try again.");
            console.error("Error deleting review:", error);
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
                            <div>
                                <button
                                    className="edit-button"
                                    onClick={() => handleEditReview(review)}
                                    title="Edit Review"
                                    style={{ 
                                        marginRight: "10px",
                                        borderRadius: 50
                                    }}
                                >
                                    <i className="fas fa-pencil-alt"></i>
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteReview(review.id)}
                                    title="Delete Review"
                                    style={{
                                        borderRadius: 50
                                    }}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
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
