// import jwt from "jsonwebtoken";

// export function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader)
//     return res.status(401).json({ error: "Token não fornecido" });

//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err)
//       return res.status(403).json({ error: "Token inválido ou expirado" });

//     req.user = user;
//     next();
//   });
// }
