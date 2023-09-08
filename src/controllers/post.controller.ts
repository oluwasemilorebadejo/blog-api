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
  const posts = await Post.find();

  return res.status(200).json({
    status: "success",
    posts: posts.length,
    data: {
      posts,
    },
  });
});
