/*-
 * #%L
 * COMPASS orienteering game
 * %%
 * Copyright (C) 2021 University of Vienna
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
package at.univie.compass.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import at.univie.compass.domain.enumeration.ControlpointInfoColumn;

/**
 * A ControlpointInfo.
 */
@Entity
@Table(name = "controlpoint_info")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ControlpointInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;
 
    @Lob
    @Column(name = "image", nullable = false)
    private byte[] image;

    @Column(name = "image_content_type", nullable = false)
    private String imageContentType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "col", nullable = false)
    private ControlpointInfoColumn col;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Column(name = "message_key", nullable = false)
    private String messageKey;

    @NotNull
    @Column(name = "sort", nullable = false)
    private Integer sort;

    @ManyToMany(mappedBy = "controlpointInfos")
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnore
    private Set<Controlpoint> controlpoints = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public ControlpointInfo image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public ControlpointInfo imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public ControlpointInfoColumn getCol() {
        return col;
    }

    public ControlpointInfo col(ControlpointInfoColumn col) {
        this.col = col;
        return this;
    }

    public void setCol(ControlpointInfoColumn col) {
        this.col = col;
    }

    public String getDescription() {
        return description;
    }

    public ControlpointInfo description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public ControlpointInfo messageKey(String messageKey) {
        this.messageKey = messageKey;
        return this;
    }

    public void setMessageKey(String messageKey) {
        this.messageKey = messageKey;
    }

    public Integer getSort() {
        return sort;
    }

    public ControlpointInfo sort(Integer sort) {
        this.sort = sort;
        return this;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Set<Controlpoint> getControlpoints() {
        return controlpoints;
    }

    public ControlpointInfo controlpoints(Set<Controlpoint> controlpoints) {
        this.controlpoints = controlpoints;
        return this;
    }

    public ControlpointInfo addControlpoint(Controlpoint controlpoint) {
        this.controlpoints.add(controlpoint);
        controlpoint.getControlpointInfos().add(this);
        return this;
    }

    public ControlpointInfo removeControlpoint(Controlpoint controlpoint) {
        this.controlpoints.remove(controlpoint);
        controlpoint.getControlpointInfos().remove(this);
        return this;
    }

    public void setControlpoints(Set<Controlpoint> controlpoints) {
        this.controlpoints = controlpoints;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ControlpointInfo)) {
            return false;
        }
        return id != null && id.equals(((ControlpointInfo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ControlpointInfo{" +
            "id=" + getId() +
//            ", image='" + getImage() + "'" +
//            ", imageContentType='" + getImageContentType() + "'" +
            ", col='" + getCol() + "'" +
//            ", description='" + getDescription() + "'" +
//            ", messageKey='" + getMessageKey() + "'" +
            ", sort=" + getSort() +
            "}";
    }
}
