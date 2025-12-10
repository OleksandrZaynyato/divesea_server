import * as yup from "yup";

export const createNFTSchema = yup.object().shape({
    name: yup.string().required('Name is required').min(1, 'Name must be at least 1 character').max(100, 'Name cannot exceed 100 characters'),
    description: yup.string().nullable(),
    imageBase64: yup.string().required("Image in Base64 format is required").matches(/^data:image\/(png|jpeg|jpg|gif);base64,/, 'Image must be in Base64 format'),
    attributes: yup.array().of(
        yup.object({
            trait_type: yup.string().required('Trait type is required'),
            value: yup.string().required('Value is required')
        })
    ).nullable(),

    owner: yup.object({
        username: yup.string().nullable(),
        userId: yup.string().nullable(), // якщо userId — ObjectId, yup.string ок
    }),
    royaltyPercentage: yup.number().min(0, 'Royalty percentage cannot be less than 0').max(100, 'Royalty percentage cannot exceed 100').nullable(),
    size: yup.string().nullable(),
    tags: yup.array().of(yup.string()).nullable(),
    price: yup.number().nullable(),
    inStock: yup.number().nullable(),

    isOnSale: yup.boolean().nullable(),
    isOnDirectSale: yup.boolean().nullable(),

    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable()
});