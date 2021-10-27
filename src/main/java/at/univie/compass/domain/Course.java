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

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonManagedReference;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Course extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "shared")
    private Boolean shared;

    @Lob
    @Column(name = "map_final_small")
    private byte[] mapFinalSmall;

    @Column(name = "map_final_small_content_type")
    private String mapFinalSmallContentType;

    @Column(name = "location")
    private String location;

    @Column(name = "altitude_up")
    private Double altitudeUp;

    @Column(name = "altitude_down")
    private Double altitudeDown;

    @Column(name = "length")
    private Double length;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private OrienteeringMap orienteeringMap;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval=true)
//    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Controlpoint> controlpoints = new HashSet<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<SharedCourse> sharedCourses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Course name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isShared() {
        return shared;
    }

    public Course shared(Boolean shared) {
        this.shared = shared;
        return this;
    }

    public void setShared(Boolean shared) {
        this.shared = shared;
    }

    public byte[] getMapFinalSmall() {
        return mapFinalSmall;
    }

    public Course mapFinalSmall(byte[] mapFinalSmall) {
        this.mapFinalSmall = mapFinalSmall;
        return this;
    }

    public void setMapFinalSmall(byte[] mapFinalSmall) {
        this.mapFinalSmall = mapFinalSmall;
    }

    public String getMapFinalSmallContentType() {
        return mapFinalSmallContentType;
    }

    public Course mapFinalSmallContentType(String mapFinalSmallContentType) {
        this.mapFinalSmallContentType = mapFinalSmallContentType;
        return this;
    }

    public void setMapFinalSmallContentType(String mapFinalSmallContentType) {
        this.mapFinalSmallContentType = mapFinalSmallContentType;
    }

    public String getLocation() {
        return location;
    }

    public Course location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getAltitudeUp() {
        return altitudeUp;
    }

    public Course altitudeUp(Double altitudeUp) {
        this.altitudeUp = altitudeUp;
        return this;
    }

    public void setAltitudeUp(Double altitudeUp) {
        this.altitudeUp = altitudeUp;
    }

    public Double getAltitudeDown() {
        return altitudeDown;
    }

    public Course altitudeDown(Double altitudeDown) {
        this.altitudeDown = altitudeDown;
        return this;
    }

    public void setAltitudeDown(Double altitudeDown) {
        this.altitudeDown = altitudeDown;
    }

    public Double getLength() {
        return length;
    }

    public Course length(Double length) {
        this.length = length;
        return this;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public OrienteeringMap getOrienteeringMap() {
        return orienteeringMap;
    }

    public Course orienteeringMap(OrienteeringMap orienteeringMap) {
        this.orienteeringMap = orienteeringMap;
        return this;
    }

    public void setOrienteeringMap(OrienteeringMap orienteeringMap) {
        this.orienteeringMap = orienteeringMap;
    }

    public Set<Controlpoint> getControlpoints() {
        return controlpoints;
    }

    public Course controlpoints(Set<Controlpoint> controlpoints) {
        this.controlpoints = controlpoints;
        return this;
    }

    public Course addControlpoint(Controlpoint controlpoint) {
        this.controlpoints.add(controlpoint);
        controlpoint.setCourse(this);
        return this;
    }

    public Course removeControlpoint(Controlpoint controlpoint) {
        this.controlpoints.remove(controlpoint);
        controlpoint.setCourse(null);
        return this;
    }

    public void setControlpoints(Set<Controlpoint> controlpoints) {
        this.controlpoints = controlpoints;
    }

    public Set<SharedCourse> getSharedCourses() {
        return sharedCourses;
    }

    public Course sharedCourses(Set<SharedCourse> sharedCourses) {
        this.sharedCourses = sharedCourses;
        return this;
    }

    public Course addSharedCourse(SharedCourse sharedCourse) {
        this.sharedCourses.add(sharedCourse);
        sharedCourse.setCourse(this);
        return this;
    }

    public Course removeSharedCourse(SharedCourse sharedCourse) {
        this.sharedCourses.remove(sharedCourse);
        sharedCourse.setCourse(null);
        return this;
    }

    public void setSharedCourses(Set<SharedCourse> sharedCourses) {
        this.sharedCourses = sharedCourses;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course)) {
            return false;
        }
        return id != null && id.equals(((Course) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Course{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", shared='" + isShared() + "'" +
            ", mapFinalSmall='" + getMapFinalSmall() + "'" +
            ", mapFinalSmallContentType='" + getMapFinalSmallContentType() + "'" +
            ", location='" + getLocation() + "'" +
            ", altitudeUp=" + getAltitudeUp() +
            ", altitudeDown=" + getAltitudeDown() +
            ", length=" + getLength() +
            "}";
    }
}
