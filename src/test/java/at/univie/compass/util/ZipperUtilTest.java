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
package at.univie.compass.util;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.core.Is.is;
import static org.hamcrest.CoreMatchers.*;

import java.io.IOException;
import java.util.zip.DataFormatException;

import org.junit.jupiter.api.Test;

class ZipperUtilTest {

    @Test
    void zipAndUnzip() throws IOException, DataFormatException {

        String test = "1234567890";
        
        byte[] zippedBytes = ZipperUtil.compress(test.getBytes());
        
        assertNotNull(zippedBytes);
        
        byte[] unzippedBytes = ZipperUtil.decompress(zippedBytes);
        
        assertThat(unzippedBytes, is(notNullValue()));
        assertThat(unzippedBytes, is(test.getBytes()));
    }
}
