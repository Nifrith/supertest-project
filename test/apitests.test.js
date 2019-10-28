const supertest = require('supertest');
const express = require('express');
const host = "http://localhost:3000";
const app = require('../app');
const request = supertest(app);

const mockedUsers = [
    {
        id:1,
        name: "Josue cea",
        email :"josue@yahoo.com",
        department: "qa"
    },
    {
        id:2,
        name: "Ñandu Gorras",
        email :"ñandu@yahoo.com",
        department: "qa"
    }
];



describe("Users API Test suite", ()=>{

    jest.setTimeout(5000);

    it("STATUS 200 GET - should get all users", async () =>{
      const response = await request.get("/users");

      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
      expect(response.body).toEqual(mockedUsers);
    })

    it("STATUS 200 GET - should get one user", async () =>{
        const response = await request.get("/users/2");
        
        expect(response.status).toBe(200);
        expect(response.body[0]).toEqual(mockedUsers[1]);
      })

    it("STATUS 201 CREATED - should insert one user", async () =>{
      const users = await request.get("/users");
      const countBefore = users.body.length;

      const response = await request.post("/users").send({
        name: "Aquiles Bailo",
        email:  "aquiles@outlook.es",
        department: "dance central"
      });
      
      expect(response.status).toBe(201);
      expect(response.body.length).toEqual(countBefore+1); /* Why +1? because whe are
      responding all users registered, and with a new one, the total increments in one*/
      })

      it("STATUS 201 created - should update one user", async () =>{
        const response = await request.put("/users/2").send({
            department: "design"
        });

        expect(response.status).toBe(201);
        expect(response.body.user.department).toEqual("design");
      })

      it("STATUS 201 created - should delete one user", async () =>{
        const response = await request.delete("/users/2");            
        expect(response.status).toBe(200);
        response.body.users.forEach(user =>{
            if(user.name === "Ñandu Gorras"){
                throw new Error("user was not deleted succesfully");
            }
        })
      })

      it("STATUS 204 No content - should not get an unexisting user", async () =>{
        const response = await request.get("/users/x");
            
        expect(response.status).toBe(204);
        
      })

      it("STATUS 404 Not found - should not update an unexisting user", async () =>{
        const response = await request.put("/users/x").send({
            department: "design"
        });            
        expect(response.status).toBe(404);
        
      })

      it("STATUS 400 bad request - should not insert a new user", async () =>{
        const response = await request.post("/users").send({
            abdc: "blah"
        });
        expect(response.status).toBe(400); 
      })

      it("STATUS 404 Not found - should not delete an unexisting user", async () =>{
        const response = await request.delete("/users/x")            
        expect(response.status).toBe(404);
        
      })

});
