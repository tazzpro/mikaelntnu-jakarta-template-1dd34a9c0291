/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package no.ntnu.tollefsen.template.domain;

import java.io.Serializable;
import java.math.BigDecimal;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author rasmu
 */
@Entity
@Data @AllArgsConstructor @NoArgsConstructor
public class Item implements Serializable {
    @Id @GeneratedValue
    Long id;
    
    String title;
    BigDecimal price;
    String description;
    
    @ManyToOne
    User seller;
    
    @ManyToOne
    User buyer;
}
