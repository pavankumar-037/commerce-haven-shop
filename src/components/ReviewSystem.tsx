
import { useState, useEffect } from 'react';
import { Star, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  isEdited?: boolean;
}

interface ReviewSystemProps {
  productId: number;
  isAdmin?: boolean;
}

const ReviewSystem = ({ productId, isAdmin = false }: ReviewSystemProps) => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = () => {
    const savedReviews = localStorage.getItem('productReviews');
    if (savedReviews) {
      const allReviews = JSON.parse(savedReviews);
      const productReviews = allReviews.filter((r: Review) => r.productId === productId);
      setReviews(productReviews);
    }
  };

  const saveReviews = (updatedReviews: Review[]) => {
    const savedReviews = localStorage.getItem('productReviews');
    const allReviews = savedReviews ? JSON.parse(savedReviews) : [];
    const otherReviews = allReviews.filter((r: Review) => r.productId !== productId);
    const newAllReviews = [...otherReviews, ...updatedReviews];
    localStorage.setItem('productReviews', JSON.stringify(newAllReviews));
    setReviews(updatedReviews);
  };

  const handleSubmitReview = () => {
    if (!formData.userName.trim() || !formData.comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (editingReview) {
      const updatedReviews = reviews.map(r =>
        r.id === editingReview.id
          ? {
              ...r,
              userName: formData.userName,
              rating: formData.rating,
              comment: formData.comment,
              isEdited: true
            }
          : r
      );
      saveReviews(updatedReviews);
      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully",
      });
    } else {
      const newReview: Review = {
        id: Date.now().toString(),
        productId,
        userId: 'user-' + Date.now(),
        userName: formData.userName,
        rating: formData.rating,
        comment: formData.comment,
        createdAt: new Date().toISOString()
      };
      const updatedReviews = [newReview, ...reviews];
      saveReviews(updatedReviews);
      toast({
        title: "Review Added",
        description: "Thank you for your review!",
      });
    }

    setFormData({ userName: '', rating: 5, comment: '' });
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setFormData({
      userName: review.userName,
      rating: review.rating,
      comment: review.comment
    });
    setShowReviewForm(true);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    saveReviews(updatedReviews);
    toast({
      title: "Review Deleted",
      description: "Review has been removed",
    });
  };

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive && onChange ? () => onChange(i) : undefined}
        />
      );
    }
    return stars;
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Customer Reviews</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-sm text-gray-600">
              ({averageRating.toFixed(1)}) • {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        {!isAdmin && (
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingReview ? 'Edit Review' : 'Write a Review'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <Label>Rating</Label>
              <div className="flex space-x-1 mt-1">
                {renderStars(formData.rating, true, (rating) => 
                  setFormData({ ...formData, rating })
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="comment">Review</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSubmitReview}>
                {editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowReviewForm(false);
                  setEditingReview(null);
                  setFormData({ userName: '', rating: 5, comment: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                {isAdmin && (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditReview(review)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteReview(review.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(review.createdAt).toLocaleDateString()}
                {review.isEdited && <span className="ml-2">(edited)</span>}
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
