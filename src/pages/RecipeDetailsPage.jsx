import React from "react";
import { useParams } from "react-router-dom";
import { fetchMealDetails } from "../api/mealApi"; // ✅ fixed import
import RecipeDetails from "../components/RecipeDetails";
import Loader from "../components/Loader";
import { pushRecent } from "../utils/localStorageUtils";
import "../styles/RecipeDetailsPage.css";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const [meal, setMeal] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mealData = await fetchMealDetails(id);
        setMeal(mealData);
        if (mealData) {
          pushRecent({
            idMeal: mealData.idMeal,
            strMeal: mealData.strMeal,
            strMealThumb: mealData.strMealThumb,
          });
        }
      } catch (error) {
        console.error("Error fetching meal details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="container app-container text-center py-5">
        <Loader />
      </div>
    );

  if (!meal)
    return (
      <div className="container app-container text-center py-5">
        <h4 className="text-danger">❌ Recipe not found</h4>
      </div>
    );

  return (
    <div className="container app-container recipe-details-page py-5 animate__animated animate__fadeIn">
      <RecipeDetails meal={meal} />
    </div>
  );
}
