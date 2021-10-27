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
package at.univie.compass.web.rest;

import at.univie.compass.CompassApp;
import at.univie.compass.domain.ResultAnswer;
import at.univie.compass.domain.ResultQuestion;
import at.univie.compass.repository.ResultAnswerRepository;
import at.univie.compass.security.AuthoritiesConstants;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ResultAnswerResource} REST controller.
 */
@SpringBootTest(classes = CompassApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ResultAnswerResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final Boolean DEFAULT_CORRECT = false;
    private static final Boolean UPDATED_CORRECT = true;

    private static final Boolean DEFAULT_ANSWERED_CORRECTLY = false;
    private static final Boolean UPDATED_ANSWERED_CORRECTLY = true;

    @Autowired
    private ResultAnswerRepository resultAnswerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restResultAnswerMockMvc;

    private ResultAnswer resultAnswer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultAnswer createEntity(EntityManager em) {
        ResultAnswer resultAnswer = new ResultAnswer()
            .text(DEFAULT_TEXT)
            .correct(DEFAULT_CORRECT)
            .answeredCorrectly(DEFAULT_ANSWERED_CORRECTLY);
        // Add required entity
        ResultQuestion resultQuestion;
        if (TestUtil.findAll(em, ResultQuestion.class).isEmpty()) {
            resultQuestion = ResultQuestionResourceIT.createEntity(em);
            em.persist(resultQuestion);
            em.flush();
        } else {
            resultQuestion = TestUtil.findAll(em, ResultQuestion.class).get(0);
        }
        resultAnswer.setResultQuestion(resultQuestion);
        return resultAnswer;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ResultAnswer createUpdatedEntity(EntityManager em) {
        ResultAnswer resultAnswer = new ResultAnswer()
            .text(UPDATED_TEXT)
            .correct(UPDATED_CORRECT)
            .answeredCorrectly(UPDATED_ANSWERED_CORRECTLY);
        // Add required entity
        ResultQuestion resultQuestion;
        if (TestUtil.findAll(em, ResultQuestion.class).isEmpty()) {
            resultQuestion = ResultQuestionResourceIT.createUpdatedEntity(em);
            em.persist(resultQuestion);
            em.flush();
        } else {
            resultQuestion = TestUtil.findAll(em, ResultQuestion.class).get(0);
        }
        resultAnswer.setResultQuestion(resultQuestion);
        return resultAnswer;
    }

    @BeforeEach
    public void initTest() {
        resultAnswer = createEntity(em);
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void createResultAnswer() throws Exception {
        int databaseSizeBeforeCreate = resultAnswerRepository.findAll().size();
        // Create the ResultAnswer
        restResultAnswerMockMvc.perform(post("/api/result-answers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAnswer)))
            .andExpect(status().isCreated());

        // Validate the ResultAnswer in the database
        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeCreate + 1);
        ResultAnswer testResultAnswer = resultAnswerList.get(resultAnswerList.size() - 1);
        assertThat(testResultAnswer.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testResultAnswer.isCorrect()).isEqualTo(DEFAULT_CORRECT);
        assertThat(testResultAnswer.isAnsweredCorrectly()).isEqualTo(DEFAULT_ANSWERED_CORRECTLY);
    }

    @Test
    @Transactional
    public void createResultAnswerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resultAnswerRepository.findAll().size();

        // Create the ResultAnswer with an existing ID
        resultAnswer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restResultAnswerMockMvc.perform(post("/api/result-answers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAnswer)))
            .andExpect(status().isBadRequest());

        // Validate the ResultAnswer in the database
        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = resultAnswerRepository.findAll().size();
        // set the field null
        resultAnswer.setText(null);

        // Create the ResultAnswer, which fails.


        restResultAnswerMockMvc.perform(post("/api/result-answers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAnswer)))
            .andExpect(status().isBadRequest());

        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCorrectIsRequired() throws Exception {
        int databaseSizeBeforeTest = resultAnswerRepository.findAll().size();
        // set the field null
        resultAnswer.setCorrect(null);

        // Create the ResultAnswer, which fails.


        restResultAnswerMockMvc.perform(post("/api/result-answers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAnswer)))
            .andExpect(status().isBadRequest());

        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    @WithMockUser(authorities = AuthoritiesConstants.ADMIN)
    public void getAllResultAnswers() throws Exception {
        // Initialize the database
        resultAnswerRepository.saveAndFlush(resultAnswer);

        // Get all the resultAnswerList
        restResultAnswerMockMvc.perform(get("/api/result-answers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resultAnswer.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].answeredCorrectly").value(hasItem(DEFAULT_ANSWERED_CORRECTLY.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getResultAnswer() throws Exception {
        // Initialize the database
        resultAnswerRepository.saveAndFlush(resultAnswer);

        // Get the resultAnswer
        restResultAnswerMockMvc.perform(get("/api/result-answers/{id}", resultAnswer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(resultAnswer.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.correct").value(DEFAULT_CORRECT.booleanValue()))
            .andExpect(jsonPath("$.answeredCorrectly").value(DEFAULT_ANSWERED_CORRECTLY.booleanValue()));
    }
    @Test
    @Transactional
    public void getNonExistingResultAnswer() throws Exception {
        // Get the resultAnswer
        restResultAnswerMockMvc.perform(get("/api/result-answers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    @Disabled("ResultCourse null da JsonIgnore verwendet wird")
    public void updateResultAnswer() throws Exception {
        // Initialize the database
        resultAnswerRepository.saveAndFlush(resultAnswer);

        int databaseSizeBeforeUpdate = resultAnswerRepository.findAll().size();

        // Update the resultAnswer
        ResultAnswer updatedResultAnswer = resultAnswerRepository.findById(resultAnswer.getId()).get();
        // Disconnect from session so that the updates on updatedResultAnswer are not directly saved in db
        em.detach(updatedResultAnswer);
        updatedResultAnswer
            .text(UPDATED_TEXT)
            .correct(UPDATED_CORRECT)
            .answeredCorrectly(UPDATED_ANSWERED_CORRECTLY);

        restResultAnswerMockMvc.perform(put("/api/result-answers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedResultAnswer)))
            .andExpect(status().isOk());

        // Validate the ResultAnswer in the database
        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeUpdate);
        ResultAnswer testResultAnswer = resultAnswerList.get(resultAnswerList.size() - 1);
        assertThat(testResultAnswer.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testResultAnswer.isCorrect()).isEqualTo(UPDATED_CORRECT);
        assertThat(testResultAnswer.isAnsweredCorrectly()).isEqualTo(UPDATED_ANSWERED_CORRECTLY);
    }

    @Test
    @Transactional
    public void updateNonExistingResultAnswer() throws Exception {
        int databaseSizeBeforeUpdate = resultAnswerRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restResultAnswerMockMvc.perform(put("/api/result-answers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(resultAnswer)))
            .andExpect(status().isBadRequest());

        // Validate the ResultAnswer in the database
        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteResultAnswer() throws Exception {
        // Initialize the database
        resultAnswerRepository.saveAndFlush(resultAnswer);

        int databaseSizeBeforeDelete = resultAnswerRepository.findAll().size();

        // Delete the resultAnswer
        restResultAnswerMockMvc.perform(delete("/api/result-answers/{id}", resultAnswer.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ResultAnswer> resultAnswerList = resultAnswerRepository.findAll();
        assertThat(resultAnswerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
