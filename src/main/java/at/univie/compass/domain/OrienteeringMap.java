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

import java.io.Serializable;

/**
 * A OrienteeringMap.
 */
@Entity
@Table(name = "orienteering_map")
// @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class OrienteeringMap extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @Lob
    @Column(name = "map_overlay_image")
    private byte[] mapOverlayImage;

    @Column(name = "map_overlay_image_content_type")
    private String mapOverlayImageContentType;

    @Lob
    @Column(name = "map_overlay_kml")
    private byte[] mapOverlayKml;

    @Column(name = "map_overlay_kml_content_type")
    private String mapOverlayKmlContentType;

    @Column(name = "image_scale_x")
    private Double imageScaleX;

    @Column(name = "image_scale_y")
    private Double imageScaleY;

    @Column(name = "image_center_x")
    private Double imageCenterX;

    @Column(name = "image_center_y")
    private Double imageCenterY;

    @Column(name = "image_rotation")
    private Double imageRotation;

    @Column(name = "declination")
    private Double declination;

    @OneToOne(mappedBy = "orienteeringMap")
    @JsonIgnore
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getMapOverlayImage() {
        return mapOverlayImage;
    }

    public OrienteeringMap mapOverlayImage(byte[] mapOverlayImage) {
        this.mapOverlayImage = mapOverlayImage;
        return this;
    }

    public void setMapOverlayImage(byte[] mapOverlayImage) {
        this.mapOverlayImage = mapOverlayImage;
    }

    public String getMapOverlayImageContentType() {
        return mapOverlayImageContentType;
    }

    public OrienteeringMap mapOverlayImageContentType(String mapOverlayImageContentType) {
        this.mapOverlayImageContentType = mapOverlayImageContentType;
        return this;
    }

    public void setMapOverlayImageContentType(String mapOverlayImageContentType) {
        this.mapOverlayImageContentType = mapOverlayImageContentType;
    }

    public byte[] getMapOverlayKml() {
        return mapOverlayKml;
    }

    public OrienteeringMap mapOverlayKml(byte[] mapOverlayKml) {
        this.mapOverlayKml = mapOverlayKml;
        return this;
    }

    public void setMapOverlayKml(byte[] mapOverlayKml) {
        this.mapOverlayKml = mapOverlayKml;
    }

    public String getMapOverlayKmlContentType() {
        return mapOverlayKmlContentType;
    }

    public OrienteeringMap mapOverlayKmlContentType(String mapOverlayKmlContentType) {
        this.mapOverlayKmlContentType = mapOverlayKmlContentType;
        return this;
    }

    public void setMapOverlayKmlContentType(String mapOverlayKmlContentType) {
        this.mapOverlayKmlContentType = mapOverlayKmlContentType;
    }

    public Double getImageScaleX() {
        return imageScaleX;
    }

    public OrienteeringMap imageScaleX(Double imageScaleX) {
        this.imageScaleX = imageScaleX;
        return this;
    }

    public void setImageScaleX(Double imageScaleX) {
        this.imageScaleX = imageScaleX;
    }

    public Double getImageScaleY() {
        return imageScaleY;
    }

    public OrienteeringMap imageScaleY(Double imageScaleY) {
        this.imageScaleY = imageScaleY;
        return this;
    }

    public void setImageScaleY(Double imageScaleY) {
        this.imageScaleY = imageScaleY;
    }

    public Double getImageCenterX() {
        return imageCenterX;
    }

    public OrienteeringMap imageCenterX(Double imageCenterX) {
        this.imageCenterX = imageCenterX;
        return this;
    }

    public void setImageCenterX(Double imageCenterX) {
        this.imageCenterX = imageCenterX;
    }

    public Double getImageCenterY() {
        return imageCenterY;
    }

    public OrienteeringMap imageCenterY(Double imageCenterY) {
        this.imageCenterY = imageCenterY;
        return this;
    }

    public void setImageCenterY(Double imageCenterY) {
        this.imageCenterY = imageCenterY;
    }

    public Double getImageRotation() {
        return imageRotation;
    }

    public OrienteeringMap imageRotation(Double imageRotation) {
        this.imageRotation = imageRotation;
        return this;
    }

    public void setImageRotation(Double imageRotation) {
        this.imageRotation = imageRotation;
    }

    public Double getDeclination() {
        return declination;
    }

    public OrienteeringMap declination(Double declination) {
        this.declination = declination;
        return this;
    }

    public void setDeclination(Double declination) {
        this.declination = declination;
    }

    public Course getCourse() {
        return course;
    }

    public OrienteeringMap course(Course course) {
        this.course = course;
        return this;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OrienteeringMap)) {
            return false;
        }
        return id != null && id.equals(((OrienteeringMap) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OrienteeringMap{" +
            "id=" + getId() +
            ", mapOverlayImage='" + getMapOverlayImage() + "'" +
            ", mapOverlayImageContentType='" + getMapOverlayImageContentType() + "'" +
            ", mapOverlayKml='" + getMapOverlayKml() + "'" +
            ", mapOverlayKmlContentType='" + getMapOverlayKmlContentType() + "'" +
            ", imageScaleX=" + getImageScaleX() +
            ", imageScaleY=" + getImageScaleY() +
            ", imageCenterX=" + getImageCenterX() +
            ", imageCenterY=" + getImageCenterY() +
            ", imageRotation=" + getImageRotation() +
            ", declination=" + getDeclination() +
            "}";
    }
}
