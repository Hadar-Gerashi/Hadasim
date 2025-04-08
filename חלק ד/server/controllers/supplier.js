import { supplierModel } from '../modules/supplier.js'
import { generetTooken } from '../utils/generateToken.js';
import { validateAddSupplier, validateLoginSupplier,validateManager } from '../modules/supplier.js'
import bcrypt from "bcryptjs";



//קבלת כל הספקים
export async function getAllsupplier(req, res) {

    try {
        let data = await supplierModel.find().select('-password')
        res.json(data)
    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't get all supplier", massege: err.massege })
    }

}


//קבלת ספק עפי המזהה שלו
export async function getSupplierById(req, res) {
    let { id } = req.params
    try {
        let data = await supplierModel.findById(id)
        if (!data)
            return res.status(404).json({ title: "No such id found", massege: err.massege })

        res.json(data)
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't get this supplier", massege: err.massege })
    }
}



//הוספת ספק חדש
export async function sign_up(req, res) {
    let { body } = req

    if(body.role==='ADMIN'){
        if (body.goods || body.representativeName || body.companyName)
        return res.status(400).json({ title: "can't add new manager", massege: "This fields is not allowed" })

        if (!body.password  || !body.phone )
        return res.status(400).json({ title: "can't add new manager", massege: "you are missing required fields" })

        let result = validateManager(body)
        if (result.error)
            return res.status(400).json({ title: result.error.details[0].message })

        
    }


    else {
    if (!body.password || !body.companyName || !body.phone || !body.representativeName || !body.goods)
        return res.status(400).json({ title: "can't add new supplier", massege: "you are missing required fields" })

    let result = validateAddSupplier(body)
    if (result.error)
        return res.status(400).json({ title: result.error.details[0].message })
    }

    try {

        let isExist = await supplierModel.findOne({ phone: body.phone }).select('-password').lean();
        if (isExist)
            return res.status(404).json({ title: "can't login", massege: "phone already exist" })


        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword; // מחליפים את הסיסמה המקורית בגיבוב
        let newData = new supplierModel(body)
        let data = await newData.save()
        let token = generetTooken(data)
        let { password, ...other } = data.toObject();
        other.token = token;
        console.log(other)
        console.log(password)
        res.json(other)

    }

    catch (err) {
        console.log(err)
        res.status(400).json({ title: "can't add new supplier", massege: err.massege })
    }
}




//כניסה של ספק קיים לפי שם חברה וטלפון 
export async function login(req, res) {
    let { body } = req

    try {

        if (!body.password  || !body.phone)
            return res.status(400).json({ title: "can't login", massege: "missing phone or password" })

        let result = validateLoginSupplier(body)
        if (result.error)
            return res.status(400).json({ title: result.error.details[0].message })

        let supplier = await supplierModel.findOne({ phone: body.phone }).lean();
        if (!supplier) {
            return res.status(404).json({ title: "No such such phone", message: "Phone not found" });
        }

        
          // השוואת הסיסמה שהוזנה מול הגיבוב השמור
          const isPasswordMatch = bcrypt.compareSync(body.password, supplier.password);
          if (!isPasswordMatch) {
              return res.status(401).json({ title: "Login failed", message: "Incorrect password" });
          }
  
          let token = generetTooken(supplier)
          let { password, ...other } = supplier;
          other.token = token;
          console.log(other)
          res.json(other)

    }

    catch (err) {
        console.log(err)
        return res.status(400).json({ title: "can't login", massege: err.massege })

    }
}



