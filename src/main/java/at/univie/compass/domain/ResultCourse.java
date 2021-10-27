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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * A ResultCourse.
 */
@Entity
@Table(name = "result_course")
//@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResultCourse extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", allocationSize = 1)
    private Long id;

    @Column(name = "nick_name")
    private String nickName;

    @Column(name = "time_stamp_finished")
    private ZonedDateTime timeStampFinished;

    @Column(name = "time_stamp_started")
    private ZonedDateTime timeStampStarted;

    @Column(name = "total_duration_in_millis")
    private Long totalDurationInMillis;

    @Column(name = "view_code")
    @Pattern(regexp = "^[a-z0-9]{5}$")
    private String viewCode;

    @Column(name = "show_position_counter")
    private Integer showPositionCounter;

    @Column(name = "switch_app_counter")
    private Integer switchAppCounter;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private ResultAdditionalInfo resultAdditionalinfo;

    @OneToMany(mappedBy = "resultCourse", cascade = CascadeType.ALL)
    //@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<ResultControlpoint> resultControlpoints = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "resultCourses", allowSetters = true)
    private SharedCourse sharedCourse;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNickName() {
        return nickName;
    }

    public ResultCourse nickName(String nickName) {
        this.nickName = nickName;
        return this;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }

    public ZonedDateTime getTimeStampFinished() {
        return timeStampFinished;
    }

    public ResultCourse timeStampFinished(ZonedDateTime timeStampFinished) {
        this.timeStampFinished = timeStampFinished;
        return this;
    }

    public void setTimeStampFinished(ZonedDateTime timeStampFinished) {
        this.timeStampFinished = timeStampFinished;
    }

    public ZonedDateTime getTimeStampStarted() {
        return timeStampStarted;
    }

    public ResultCourse timeStampStarted(ZonedDateTime timeStampStarted) {
        this.timeStampStarted = timeStampStarted;
        return this;
    }

    public void setTimeStampStarted(ZonedDateTime timeStampStarted) {
        this.timeStampStarted = timeStampStarted;
    }

    public Long getTotalDurationInMillis() {
        return totalDurationInMillis;
    }

    public ResultCourse totalDurationInMillis(Long totalDurationInMillis) {
        this.totalDurationInMillis = totalDurationInMillis;
        return this;
    }

    public void setTotalDurationInMillis(Long totalDurationInMillis) {
        this.totalDurationInMillis = totalDurationInMillis;
    }

    public String getViewCode() {
        return viewCode;
    }

    public ResultCourse viewCode(String viewCode) {
        this.viewCode = viewCode;
        return this;
    }

    public void setViewCode(String viewCode) {
        this.viewCode = viewCode;
    }

    public Integer getShowPositionCounter() {
        return showPositionCounter;
    }

    public ResultCourse showPositionCounter(Integer showPositionCounter) {
        this.showPositionCounter = showPositionCounter;
        return this;
    }

    public void setShowPositionCounter(Integer showPositionCounter) {
        this.showPositionCounter = showPositionCounter;
    }

    public Integer getSwitchAppCounter() {
        return switchAppCounter;
    }

    public ResultCourse switchAppCounter(Integer switchAppCounter) {
        this.switchAppCounter = switchAppCounter;
        return this;
    }

    public void setSwitchAppCounter(Integer switchAppCounter) {
        this.switchAppCounter = switchAppCounter;
    }

    public ResultAdditionalInfo getResultAdditionalinfo() {
        return resultAdditionalinfo;
    }

    public ResultCourse resultAdditionalinfo(ResultAdditionalInfo resultAdditionalInfo) {
        this.resultAdditionalinfo = resultAdditionalInfo;
        return this;
    }

    public void setResultAdditionalinfo(ResultAdditionalInfo resultAdditionalInfo) {
        this.resultAdditionalinfo = resultAdditionalInfo;
    }

    public Set<ResultControlpoint> getResultControlpoints() {
        return resultControlpoints;
    }

    public ResultCourse resultControlpoints(Set<ResultControlpoint> resultControlpoints) {
        this.resultControlpoints = resultControlpoints;
        return this;
    }

    public ResultCourse addResultControlpoint(ResultControlpoint resultControlpoint) {
        this.resultControlpoints.add(resultControlpoint);
        resultControlpoint.setResultCourse(this);
        return this;
    }

    public ResultCourse removeResultControlpoint(ResultControlpoint resultControlpoint) {
        this.resultControlpoints.remove(resultControlpoint);
        resultControlpoint.setResultCourse(null);
        return this;
    }

    public void setResultControlpoints(Set<ResultControlpoint> resultControlpoints) {
        this.resultControlpoints = resultControlpoints;
    }

    public SharedCourse getSharedCourse() {
        return sharedCourse;
    }

    public ResultCourse sharedCourse(SharedCourse sharedCourse) {
        this.sharedCourse = sharedCourse;
        return this;
    }

    public void setSharedCourse(SharedCourse sharedCourse) {
        this.sharedCourse = sharedCourse;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ResultCourse)) {
            return false;
        }
        return id != null && id.equals(((ResultCourse) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ResultCourse{" +
            "id=" + getId() +
            ", nickName='" + getNickName() + "'" +
            ", timeStampFinished='" + getTimeStampFinished() + "'" +
            ", timeStampStarted='" + getTimeStampStarted() + "'" +
            ", totalDurationInMillis=" + getTotalDurationInMillis() +
            ", viewCode='" + getViewCode() + "'" +
            ", showPositionCounter=" + getShowPositionCounter() +
            ", switchAppCounter=" + getSwitchAppCounter() +
            "}";
    }
}
