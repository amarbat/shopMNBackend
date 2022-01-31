var express               = require ('express');
var router                = express.Router ();
var bcrypt                = require ("bcryptjs");
var jwt                   = require ("jsonwebtoken");
/* GET home page. */


const User                = require ("../model/user");


router.post ("/register", async (req, res) => {

  // Our register logic starts here
  try {
    // Get user input
    const { first_name, last_name, email, password }
                          = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      // console.log (`${email} ${password} ${first_name} ${last_name}`);
      res.status (400).send ("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser         = await User.findOne ({ email });

    if (oldUser) {
      return res.status (409).send ("User Already Exist. Please Login");
    }

    // TODO: password length check, A-Z, a-z, 0-9, !?

    //Encrypt user password
    encryptedPassword     = await bcrypt.hash (
      password, 10
                            );

    // Create user in our database
    const user            = await User.create ({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token           = jwt.sign (
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token            = token;

    // return new user
    res.status (201).json (user);
  } catch (err) {
    console.log (err);
  }
});



router.post ("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password }
                          = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    // TODO: Validate password length and all that

    // Validate if user exist in our database
    const user            = await User.findOne ({ email });

    if (user && (await bcrypt.compare (password, user.password))) {
      // Create token
      const token         = jwt.sign (
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token          = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send ("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});


module.exports            = router;
