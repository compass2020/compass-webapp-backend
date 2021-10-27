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

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A Controlpoint.
 */
@Entity
@Table(name = "controlpoint")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Controlpoint extends AbstractAuditingEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "sequence", nullable = false)
    private Integer sequence;

    @Column(name = "control_code")
    private Integer controlCode;

    @NotNull
    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @NotNull
    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Column(name = "elevation")
    private Double elevation;

    @NotNull
    @Column(name = "radius", nullable = false)
    private Integer radius;

    @NotNull
    @Column(name = "skippable", nullable = false)
    private Boolean skippable;

    @NotNull
    @Column(name = "team", nullable = false)
    private Boolean team;

    @Column(name = "qr_code")
    private String qrCode;

    @Column(name = "description")
    private String description;

    @ManyToMany
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @NotNull
    @JoinTable(
      name = "controlpoint_question",
      joinColumns = @JoinColumn(name = "controlpoint_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "question_id", referencedColumnName = "id")
    )
    private Set<Question> questions = new HashSet<>();

    @ManyToMany
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
      name = "controlpoint_controlpoint_info",
      joinColumns = @JoinColumn(name = "controlpoint_id", referencedColumnName = "id"),
      inverseJoinColumns = @JoinColumn(name = "controlpoint_info_id", referencedColumnName = "id")
    )
    private Set<ControlpointInfo> controlpointInfos = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnore // parent immer im jason ignorieren
    @JsonIgnoreProperties(value = "controlpoints", allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSequence() {
        return sequence;
    }

    public Controlpoint sequence(Integer sequence) {
        this.sequence = sequence;
        return this;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public Integer getControlCode() {
        return controlCode;
    }

    public Controlpoint controlCode(Integer controlCode) {
        this.controlCode = controlCode;
        return this;
    }

    public void setControlCode(Integer controlCode) {
        this.controlCode = controlCode;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Controlpoint latitude(Double latitude) {
        this.latitude = latitude;
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Controlpoint longitude(Double longitude) {
        this.longitude = longitude;
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getElevation() {
        return elevation;
    }

    public Controlpoint elevation(Double elevation) {
        this.elevation = elevation;
        return this;
    }

    public void setElevation(Double elevation) {
        this.elevation = elevation;
    }

    public Integer getRadius() {
        return radius;
    }

    public Controlpoint radius(Integer radius) {
        this.radius = radius;
        return this;
    }

    public void setRadius(Integer radius) {
        this.radius = radius;
    }

    public Boolean isSkippable() {
        return skippable;
    }

    public Controlpoint skippable(Boolean skippable) {
        this.skippable = skippable;
        return this;
    }

    public void setSkippable(Boolean skippable) {
        this.skippable = skippable;
    }

    public Boolean isTeam() {
        return team;
    }

    public Controlpoint team(Boolean team) {
        this.team = team;
        return this;
    }

    public void setTeam(Boolean team) {
        this.team = team;
    }

    public String getQrCode() {
        return qrCode;
    }

    public Controlpoint qrCode(String qrCode) {
        this.qrCode = qrCode;
        return this;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getDescription() {
        return description;
    }

    public Controlpoint description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public Controlpoint questions(Set<Question> questions) {
        this.questions = questions;
        return this;
    }

    public Controlpoint addQuestion(Question question) {
        this.questions.add(question);
        question.getControlpoints().add(this);
        return this;
    }

    public Controlpoint removeQuestion(Question question) {
        this.questions.remove(question);
        question.getControlpoints().remove(this);
        return this;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    public Set<ControlpointInfo> getControlpointInfos() {
        return controlpointInfos;
    }

    public Controlpoint controlpointInfos(Set<ControlpointInfo> controlpointInfos) {
        this.controlpointInfos = controlpointInfos;
        return this;
    }

    public Controlpoint addControlpointInfo(ControlpointInfo controlpointInfo) {
        this.controlpointInfos.add(controlpointInfo);
        controlpointInfo.getControlpoints().add(this);
        return this;
    }

    public Controlpoint removeControlpointInfo(ControlpointInfo controlpointInfo) {
        this.controlpointInfos.remove(controlpointInfo);
        controlpointInfo.getControlpoints().remove(this);
        return this;
    }

    public void setControlpointInfos(Set<ControlpointInfo> controlpointInfos) {
        this.controlpointInfos = controlpointInfos;
    }

    public Course getCourse() {
        return course;
    }

    public Controlpoint course(Course course) {
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
        if (!(o instanceof Controlpoint)) {
            return false;
        }
        return id != null && id.equals(((Controlpoint) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Controlpoint{" +
            "id=" + getId() +
            ", sequence=" + getSequence() +
            ", controlCode=" + getControlCode() +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", elevation=" + getElevation() +
            ", radius=" + getRadius() +
            ", skippable='" + isSkippable() + "'" +
            ", team='" + isTeam() + "'" +
            ", qrCode='" + getQrCode() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
