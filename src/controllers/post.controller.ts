import { catchAsync } from "../utils/errors";
import Post from "../entities/post.entity";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

export const addPost = catchAsync(async (req: Request, res: Response) => {
  // Get the current user (assuming you have authentication middleware)
  const currentUser = req.body.user;

  // Create a new blog post
  const newPost = new Post();
  newPost.id = req.body.id;
  newPost.title = req.body.title;
  newPost.content = req.body.content;
  newPost.author = currentUser;

  // Save the post to the database
  await newPost.save();

  // Return a success response
  return res.status(201).json({
    status: "success",
    data: {
      post: newPost,
    },
  });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await Post.findOneBy({ id: postId });

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  // Update post properties based on your requirements
  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  await Post.save(post);

  return res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const post = await Post.findOneBy({ id: postId });

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    const post = await Post.findOneBy({ id: postId });

    if (!post) {
      return next(new AppError("Post not found", 404));
    }

    await Post.remove(post);

    return res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  // Pagination
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const skip = (page - 1) * pageSize;

  // Filtering
  const titleFilter = (req.query.titleFilter as string) || ""; // Filter by title

  // Sorting
  let sortOrder: "ASC" | "DESC" | undefined = undefined; // Default is undefined
  const sortOrderParam = req.query.sortOrder as string;
  if (sortOrderParam === "asc" || sortOrderParam === "desc") {
    sortOrder = sortOrderParam.toUpperCase() as "ASC" | "DESC";
  }

  const sortField = (req.query.sortField as string) || "created_at"; // Sort by title by default

  // Field limiting
  let selectedFields: string[] | undefined;
  const fieldsParam = req.query.fields as string;

  console.log(fieldsParam);

  if (fieldsParam) {
    selectedFields = fieldsParam.split(",");
  }

  // Build the query
  const queryBuilder = Post.createQueryBuilder("post")
    .where("post.title LIKE :titleFilter", { titleFilter: `%${titleFilter}%` })
    .orderBy(`post.${sortField}`, sortOrder)
    .skip(skip)
    .take(pageSize);

  // Select specific fields if specified
  if (selectedFields) {
    queryBuilder.select(selectedFields);
  }

  // Execute the query
  const posts = await queryBuilder.getMany();

  return res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});
