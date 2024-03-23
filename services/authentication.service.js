const MongoDB = require("./mongodb.service");
const { mongoConfig ,tokenSecret } = require("../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRegister = async (user) => {
  try {
    if (!user?.username || !user?.email || !user?.password)
      return { status: false, message: "תמלא את השדות" };
    const passwordHash = await bcrypt.hash(user?.password, 10);
    let userObject = {
      username: user?.username,
      email: user?.email,
      password: passwordHash,
    };
    let savedUser = await MongoDB.db
      .collection(mongoConfig.collections.USERS)
      .insertOne(userObject);
      if(savedUser?.acknowledged && savedUser.insertedId){
        let token = jwt.sign(
            { username: userObject?.username, email: userObject?.email },
            tokenSecret,
            { expiresIn: "24h" }
          );
        return{
            status: true,
            message:"נרמשת בהצלחה!",
            data: token,
        };
    }else{
        return {
            status: false,
            message:"שגיאת הרשמה"
        };
     }
    console.log(savedUser);
  } catch (error) {
    console.log(error);
    let errorMessage = "שגיאה בהזנת הנתונים";
    error?.code === 11000 && error?.keyPattern?.username
    ? (errorMessage = "שם משתמש כבר קיים")
    :null;
    error?.code === 11000 && error?.keyPattern?.email
    ? (errorMessage = "מייל כבר קיים")
    :null;
    return{
        status: false,
        message: errorMessage,
        error: error?.toString(),
    };
  }
};
const userLogin = async (user) => {
    try {
      if (!user?.username || !user?.password)
        return { status: false, message: "נא למלא את כל השדות" };
      let userObject = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .findOne({ username: user?.username });
      if (userObject) {
        let isPasswordVerfied = await bcrypt.compare(
          user?.password,
          userObject?.password
        );
        if (isPasswordVerfied) {
          let token = jwt.sign(
            { username: userObject?.username, email: userObject?.email },
            tokenSecret,
            { expiresIn: "24h" }
          );
          return {
            status: true,
            message: "התחברות המשתמש הצליחה",
            data: token,
          };
        } else {
          return {
            status: false,
            message: "סיסמה שגויה",
          };
        }
      } else {
        return {
          status: false,
          message: "משתמש לא נמצא",
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "נכשלה התחברות המשתמש",
        error: error?.toString(),
      };
    }
  };
  const checkUserExist = async (query) => {
    let messages = {
      email: "המשתמש כבר קיים",
      username: "שם המשתמש הזה תפוס",
    };
    try {
      let queryType = Object.keys(query)[0];
      let userObject = await MongoDB.db
        .collection(mongoConfig.collections.USERS)
        .findOne(query);
      return !userObject
        ? { status: true, message: `This ${queryType} לא תפוס` }
        : { status: false, message: messages[queryType] };
    } catch (error) {}
  };



module.exports = { userRegister,userLogin,checkUserExist};
