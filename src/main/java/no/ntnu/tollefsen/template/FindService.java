/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package no.ntnu.tollefsen.template;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
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
import no.ntnu.tollefsen.template.domain.MediaObject;
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
        
        Item result = new Item(null, name, BigDecimal.ONE, "Desc", null, user, null);
        ent.persist(result);
        return result;
    }
    
    @GET
    @Path("getitems")
    public List<Item> getAll() {
        return ent.createQuery("Select i from Item i", Item.class).getResultList();
    }
    
    @GET
    @RolesAllowed( value = {Group.USER})
    @Path("buyitem")
    public Response buyItem(@FormDataParam("itemId") int itemId)
    {
        try
        {
            User buyer = ent.find(User.class, principal.getName());
            List<Item> allItems = ent.createQuery("Select i from Item i ", Item.class).getResultList();
            for(Item i : allItems)
            {
                if(i.getId().equals(itemId))
                {
                    //Hacky function should not end like this :|
                    i.setBuyer(buyer);
                    return Response.ok().build();
                }
            }
        }catch(Exception e)
        {
            Logger.getLogger(ItemService.class.getName()).log(Level.SEVERE, null, e);
            return Response.serverError().build();
        }
        return Response.serverError().build();
    }
    
    @Path("create")
    @POST
    @RolesAllowed(value = {Group.USER})
    public Response addItem(
            @FormDataParam("title")String title,
            @FormDataParam("price")BigDecimal price,
            @FormDataParam("description")String description,
            FormDataMultiPart multiPart)
    {
       
        Item item;
        try {
            User user = ent.find(User.class,principal.getName());
            
            item = new Item(null, title, price, description, null, user, null);
            List<FormDataBodyPart> images = multiPart.getFields("image");
            if(images != null) {
                for(FormDataBodyPart part : images) {
                    InputStream is = part.getEntityAs(InputStream.class);
                    ContentDisposition meta = part.getContentDisposition();            

                    String pid = UUID.randomUUID().toString();
                    Files.copy(is, Paths.get(getPhotoPath(),pid));

                    MediaObject photo = new MediaObject(pid, user,meta.getFileName(),meta.getSize(),meta.getType());
                    ent.persist(photo);
                    item.addPhoto(photo);
                }
            }

            ent.persist(item);
        } catch (IOException ex) {
            Logger.getLogger(FindService.class.getName()).log(Level.SEVERE, null, ex);
            return Response.serverError().build();
        }
        
        return Response.ok(item).build();
    }
    
    private String getPhotoPath() {
        return ".";
    }
    
    
    
    
    
    
}
