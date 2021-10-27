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
import java.time.ZonedDateTime;
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
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A ResultControlpoint.
 */
@Entity
@Table(name = "result_controlpoint")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResultControlpoint extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @NotNull
    @Column(name = "sequence", nullable = false)
    private Integer sequence;

    @Column(name = "time_reached")
    private ZonedDateTime timeReached;

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "skip_allowed")
    private Boolean skipAllowed;

    @Column(name = "reached")
    private Boolean reached;

    @Column(name = "borg_scale")
    private Integer borgScale;

    @Column(name = "force_skipped")
    private Boolean forceSkipped;

    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @NotNull
    @JoinTable(name = "result_controlpoint_result_question",
               joinColumns = @JoinColumn(name = "result_controlpoint_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "result_question_id", referencedColumnName = "id"))
    private Set<ResultQuestion> resultQuestions = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "resultControlpoints", allowSetters = true)
    @JsonIgnore // parent immer im jason ignorieren
    private ResultCourse resultCourse;

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

    public ResultControlpoint sequence(Integer sequence) {
        this.sequence = sequence;
        return this;
    }

    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }

    public ZonedDateTime getTimeReached() {
        return timeReached;
    }

    public ResultControlpoint timeReached(ZonedDateTime timeReached) {
        this.timeReached = timeReached;
        return this;
    }

    public void setTimeReached(ZonedDateTime timeReached) {
        this.timeReached = timeReached;
    }

    public Double getLatitude() {
        return latitude;
    }

    public ResultControlpoint latitude(Double latitude) {
        this.latitude = latitude;
        return this;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public ResultControlpoint longitude(Double longitude) {
        this.longitude = longitude;
        return this;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Boolean isSkipAllowed() {
        return skipAllowed;
    }

    public ResultControlpoint skipAllowed(Boolean skipAllowed) {
        this.skipAllowed = skipAllowed;
        return this;
    }

    public void setSkipAllowed(Boolean skipAllowed) {
        this.skipAllowed = skipAllowed;
    }

    public Boolean isReached() {
        return reached;
    }

    public ResultControlpoint reached(Boolean reached) {
        this.reached = reached;
        return this;
    }

    public void setReached(Boolean reached) {
        this.reached = reached;
    }

    public Integer getBorgScale() {
        return borgScale;
    }

    public ResultControlpoint borgScale(Integer borgScale) {
        this.borgScale = borgScale;
        return this;
    }

    public void setBorgScale(Integer borgScale) {
        this.borgScale = borgScale;
    }

    public Boolean isForceSkipped() {
        return forceSkipped;
    }

    public ResultControlpoint forceSkipped(Boolean forceSkipped) {
        this.forceSkipped = forceSkipped;
        return this;
    }

    public void setForceSkipped(Boolean forceSkipped) {
        this.forceSkipped = forceSkipped;
    }

    public Set<ResultQuestion> getResultQuestions() {
        return resultQuestions;
    }

    public ResultControlpoint resultQuestions(Set<ResultQuestion> resultQuestions) {
        this.resultQuestions = resultQuestions;
        return this;
    }

    public ResultControlpoint addResultQuestion(ResultQuestion resultQuestion) {
        this.resultQuestions.add(resultQuestion);
        resultQuestion.getResultControlpoints().add(this);
        return this;
    }

    public ResultControlpoint removeResultQuestion(ResultQuestion resultQuestion) {
        this.resultQuestions.remove(resultQuestion);
        resultQuestion.getResultControlpoints().remove(this);
        return this;
    }

    public void setResultQuestions(Set<ResultQuestion> resultQuestions) {
        this.resultQuestions = resultQuestions;
    }

    public ResultCourse getResultCourse() {
        return resultCourse;
    }

    public ResultControlpoint resultCourse(ResultCourse resultCourse) {
        this.resultCourse = resultCourse;
        return this;
    }

    public void setResultCourse(ResultCourse resultCourse) {
        this.resultCourse = resultCourse;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResultControlpoint)) {
            return false;
        }
        return id != null && id.equals(((ResultControlpoint) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResultControlpoint{" +
            "id=" + getId() +
            ", sequence=" + getSequence() +
            ", timeReached='" + getTimeReached() + "'" +
            ", latitude=" + getLatitude() +
            ", longitude=" + getLongitude() +
            ", skipAllowed='" + isSkipAllowed() + "'" +
            ", reached='" + isReached() + "'" +
            ", borgScale=" + getBorgScale() +
            ", forceSkipped='" + isForceSkipped() + "'" +
            "}";
    }
}
