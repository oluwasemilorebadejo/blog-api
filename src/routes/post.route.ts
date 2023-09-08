import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  addPost,
  getPost,
  deletePost,
  updatePost,
  getAllPosts,
} from "../controllers/post.controller";

const router: Router = Router();

router.use(protect);

router.route("/").post(addPost).get(getAllPosts);

router.route("/:id").get(getPost).delete(deletePost).patch(updatePost);

export default router;
