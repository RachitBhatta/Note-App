import yup from "yup"

export const userSchema=yup.object({
    username:yup
    .string()
    .trim()
    .min(3,"Username must be at least 3 character")
    .required(),
    email:yup
    .string()
    .email("The email is not valid")
    .required(),
    password:yup
    .string()
    .required()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[a-z]/, "Password must include at least one lowercase letter")
    .matches(/\d/, "Password must include at least one number")
    .matches(
        /[@$!%*?&]/,
      "Password must include at least one special character (@, $, !, %, *, ?, &)"
    ),
})

export const validateUser=(schema)=>async(req,res,next)=>{
    try {
        await schema.validate(req.body)
        next()
    } catch (error) {
        return res.status(404).json({
            errors:error.errors
        })
    }
}