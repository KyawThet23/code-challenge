import { NextFunction, Request, Response } from "express";
import { SqliteDataSource } from "../utils/data-source";

const resourceRepository = () => SqliteDataSource.getRepository("Resource");

// Create a new resource
export const createResource = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resource = resourceRepository().create(req.body);
    const result = await resourceRepository().save(resource);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Retrieve all resources
export const getAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const resources = await resourceRepository().find();

    if (resources.length === 0) {
      return res.status(404).json({ message: "No resources found" });
    }

    res.json(resources);
  } catch (error) {
    next(error);
  }
};

// Retrieve a single resource by ID
export const getResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const resource = await resourceRepository().findOneBy({ id: id });
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

// Update a resource by ID
export const updateResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const resource = await resourceRepository().findOneBy({ id: id });
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    resourceRepository().merge(resource, req.body);
    const result = await resourceRepository().save(resource);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Delete a resource by ID
export const deleteResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const result = await resourceRepository().delete({
      id: id,
    });
    if (result.affected === 0) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
