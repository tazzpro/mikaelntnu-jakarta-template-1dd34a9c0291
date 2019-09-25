/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package no.ntnu.tollefsen.template;

import java.io.InputStream;
import java.math.BigDecimal;
import java.rmi.server.UID;
import java.util.List;
import java.util.UUID;
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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import no.ntnu.tollefsen.template.domain.Group;
import no.ntnu.tollefsen.template.domain.Item;
import no.ntnu.tollefsen.template.domain.User;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataMultiPart;
import org.glassfish.jersey.media.multipart.FormDataParam;

/**
 *
 * @author rasmu
 */
@Path("fant")
@Stateless
public class FindService {
    @PersistenceContext
    EntityManager ent;
    
    @Inject
    JsonWebToken principal;
    
    @GET
    @RolesAllowed( value = {Group.USER})
    public Item getHello(@QueryParam("name") String name)
    {
        System.out.println("This user is" + principal.getName());
        
        User user = ent.find(User.class, principal.getName());
        
        Item result = new Item(null, name, BigDecimal.ONE, "Desc", user, null);
        ent.persist(result);
        return result;
    }
    
    @GET
    @Path("getall")
    public List<Item> getAll() {
        return ent.createQuery("Select i from Item i", Item.class).getResultList();
    }
    
    
    
    
    
    
}
