import { getAllUsersById } from "./services/user.service.js"

export function verifyUserGroups(groups = []){
    return async (req, res, next) => {
        const user_id = Number(req.query.user_id)

    if (!user_id) return res.status(401).json({ message: "Access Denied" });

    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        },
        include: {
            group: true
        }
    })

    if(!user) return res.status(401).json({ message: "Access Denied" })

    if(groups.includes(user.group.name)){
        switch (req.method) {
            case "GET":
                return user.group.read && next()
            case "POST":
                return user.group.write && next()
            case "PUT":
                return user.group.update && next();
            case "DELETE":
                return user.group.delete && next();
            case "OPTIONS":
                return next()
            default:
                break;
        }
    }
    

    return res.status(403).json({ message: "Access Denied"})
    }
}