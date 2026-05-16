import {Router} from "express";
import {
  createResource,
  deleteResourceById,
  getAllResources,
  getResourceById,
  updateResourceById,
} from "../controller/resource-controller"; 

const router = Router();

router.post("/resources", createResource);
router.get("/resources", getAllResources);
router.get("/resources/:id", getResourceById);
router.put("/resources/:id", updateResourceById);
router.delete("/resources/:id", deleteResourceById);

export default router;