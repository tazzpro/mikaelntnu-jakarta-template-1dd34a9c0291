/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package no.ntnu.tollefsen.template;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import no.ntnu.tollefsen.template.domain.Group;
import no.ntnu.tollefsen.template.domain.Item;
import no.ntnu.tollefsen.template.domain.User;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.glassfish.jersey.media.multipart.FormDataParam;

/**
 *
 * @author rasmu
 */
@Path("sellable")
@Stateless
public class ItemService {
    @PersistenceContext
    EntityManager ent;
    
    @Inject
    JsonWebToken principal;
    
    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response NewUser(@FormDataParam("firstname")String firstname,
            @FormDataParam("lastname")String lastname,
            @FormDataParam("street")String street,
            @FormDataParam("city")String city,
            @FormDataParam("postalcode")int postalcode,
            @FormDataParam("email")String email,
            @FormDataParam("uid")String uid,
            @FormDataParam("pwd")String pwd)
    {
        
        
        try{
            User user = new User();
            System.out.println("Users:" + ent.createQuery("select u from User u", User.class).getResultList());
            user.setCurrentState(User.State.ACTIVE);
            user.setFirstName(firstname);
            user.setLastName(lastname);
            user.setPassword(pwd);
            user.setUserid(uid);
            user.setEmail(email);
            
        }catch(Exception e)
        {
            Logger.getLogger(ItemService.class.getName()).log(Level.SEVERE, null, e);
            return Response.serverError().build();
        }
        return Response.ok().build();
    }
    
    @GET
    @Path("deleteme")
    public Response deleteMe(@FormDataParam("userId") int userId)
    {
        User user = ent.find(User.class,principal.getName());
        //Not a TRUE delete, but for the user he should no longer be able to log in
        //good for keeping logs on the deleted users purchases
        user.setCurrentState(User.State.INACTIVE);
        return Response.ok().build();
    }
    
    
    
}
