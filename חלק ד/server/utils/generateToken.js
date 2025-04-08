import jwt from 'jsonwebtoken'

export function generetTooken(supplier) {
    const result = jwt.sign({ supplierId: supplier._id, role: supplier.role, supplierPaasword: supplier.password }, process.env.SECRET_KEY, { expiresIn: "1h" })
    return result
}