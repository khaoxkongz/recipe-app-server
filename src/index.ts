import express, { Request, Response } from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/api/recipes/search", async (req: Request, res: Response) => {
	const searchTerm = req.query.searchTerm as string;
	const page = parseInt(req.query.page as string);
	const results = await RecipeAPI.searchRecipes(searchTerm, page);

	return res.json(results);
});

app.get("/api/recipes/:id/summary", async (req: Request, res: Response) => {
	const recipeId = req.params.id;
	const results = await RecipeAPI.getRecipeSummary(recipeId);
	return res.json(results);
});

app.listen(8888, () => {
	console.log("server running on localhost:8888");
});
