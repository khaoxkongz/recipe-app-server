import express, { Request, Response } from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import { PrismaClient } from "@prisma/client";

const app = express();
const prismaCilent = new PrismaClient();
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

app.post("/api/recipes/favourite", async (req: Request, res: Response) => {
	const recipeId = req.body.recipeId;

	try {
		const favouriteRecipe = await prismaCilent.favouriteRecipes.create({
			data: {
				recipeId: recipeId,
			},
		});
		return res.status(201).json(favouriteRecipe);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Oops, something went worng" });
	}
});

app.get("/api/recipes/favourite", async (req: Request, res: Response) => {
	try {
		const recipe = await prismaCilent.favouriteRecipes.findMany();
		const recipeIds = recipe.map((recipe) => recipe.recipeId.toString());

		const favourites = await RecipeAPI.getFavouriteRecipesByIDs(recipeIds);

		return res.json(favourites);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Oops, something went worng" });
	}
});

app.delete("/api/recipes/favourite", async (req, res) => {
	const recipeId = req.body.recipeId;

	try {
		await prismaCilent.favouriteRecipes.delete({
			where: {
				recipeId: recipeId,
			},
		});
		return res.status(204).send();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Oops, something went worng" });
	}
});

app.listen(8888, () => {
	console.log("server running on localhost:8888");
});
