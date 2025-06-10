import {
  createMaterial,
  deleteMaterial,
  getMaterials,
  updateMaterial,
} from "./materials.services.js";

export const createMaterialHandler = async (req, res) => {
  const { title, description, dueDate, attachmentUrl } = req.body;
  const { roomId } = req.params;
  const userId = req.user.id;
  try {
    const material = await createMaterial(
      roomId,
      userId,
      title,
      description,
      dueDate,
      attachmentUrl
    );
    return res.status(201).json({
      status: "success",
      data: material,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getMaterialsHandler = async (req, res) => {
  const { roomId } = req.params;
  try {
    const materials = await getMaterials(roomId);
    return res.status(200).json({
      status: "success",
      data: materials,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateMaterialHandler = async (req, res) => {
  const { materialId, title, description, dueDate, attachmentUrl } = req.body;
  const userId = req.user.id;
  try {
    const material = await updateMaterial(
      materialId,
      userId,
      title,
      description,
      dueDate,
      attachmentUrl
    );
    return res.status(200).json({
      status: "success",
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteMaterialHandler = async (req, res) => {
  const { materialId } = req.params;
  const userId = req.user.id;
  try {
    const material = await deleteMaterial(materialId, userId);
    return res.status(200).json({
      status: "success",
      data: material,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
