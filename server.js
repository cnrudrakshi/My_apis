const express=require('express')
const app = express();
app.use(express.json()) // this line parses incoming json body



let coursesArray = [
    {
      id:1,
      name:"Fundamentals of computer",
      duration: '3 months'
    },
    {
      id:2,
      name:"JS learning",
      duration: '6 months'
    },
    {
      id:3,
      name:"Adavnce JS",
      duration: '6 months'
    },
    {
      id:4,
      name:"HTML",
      duration: '10 months'
    },
  ]


app.get('/about',(req,res)=>{
    res.send("Welcome to my app about page....")
})

app.get('/teams',(req,res)=>{
    res.send([
        {id:1,
            name:"Hrshit"
        }
    ])
})

app.get('/courses',(req,res)=>{ //entity CRUD
    res.send(coursesArray)
})



//CRUD => 
//C: Create

app.post('/courses',(req,res)=>{ //entity CRUD
    coursesArray.push(req.body);
    //Handle all the cases of failures
    //1. courses can't have duplicate names
    //2. courses can't have less than 2 characters name
    //3. no course will have less than 1 month duration
    //4. duration or name can't be empty
    //5. we need to add incremental id
})

//R: Read

app.get('/courses',(req,res)=>{ //entity CRUD
   //getting the list of all the courses
})

app.get('/courses/:id',(req,res)=>{ //entity CRUD
    //reading one particular course
})


//U: Update

app.put('/courses/:id',(req,res)=>{ //entity CRUD
    console.log(req.params.id)// kaun sa course update krna hai
    // kya update krna hai
    console.log(req.body)
   
    //Handle all the cases of failures
    //1. check whether course exist or not
    let course = coursesArray.find(course=>course.id==req.params.id);
    if(!course){
        res.send("course not found")
    }else{
        //course ko update kr denge
         res.send("course ko update karenge")
    }
    //2. courses can't have less than 2 characters name
    //3. no course will have less than 1 month duration
    //4. duration or name can't be empty
})

app.patch('/courses/4',(req,res)=>{ //entity CRUD
    //updating one course
})


//D: Delete

app.delete('/courses/3',(req,res)=>{ //entity CRUD
     //deleting one specific course
     //course array me se course with id 3 ko uda denge

})

/*



*/


const PORT = 5354;


app.listen(PORT,()=>{
    console.log("Server started at 5354")
})


//Difference between PUT and PATCH

/*
PUT=> Whole data
{
id:1,
name:"ashutosh",
age:29,
status: "INACTIVE"
}

PATCH=> Partial data
{
status: "INACTIVE"
}


POST, PATCH, PUT, DELETE, GET


*/


/*
1. Handle all the cases of failures
2. PATCH, DELETE => Verify whether the id is correct or not?
3. Complete DELETE ka api with all the cases
4. PATCH => update should happen for partial data
5. CRUD => Data should be valid (2339,abcd)
*/


/*
users listing
todo listing


*/
