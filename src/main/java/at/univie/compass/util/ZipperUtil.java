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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

public class ZipperUtil {

    private static final int BUFFER_SIZE = 1024;


    public static byte[] compress(byte[] rawData) throws IOException {

        try (ByteArrayOutputStream stream = new ByteArrayOutputStream(rawData.length)) {

            Deflater deflater = new Deflater(Deflater.BEST_COMPRESSION, true);
            deflater.setInput(rawData);

            byte[] buffer = new byte[BUFFER_SIZE];

            deflater.finish();
            while (!deflater.finished()) {
                int count = deflater.deflate(buffer);
                stream.write(buffer, 0, count);
            }

            byte[] bytesOut = stream.toByteArray();
            deflater.end();

            return bytesOut;
        }
    }


    public static byte[] decompress(byte[] zipData) throws IOException, DataFormatException {

        try (ByteArrayOutputStream stream = new ByteArrayOutputStream(zipData.length)) {

            Inflater inflater = new Inflater(true);
            inflater.setInput(zipData);

            byte[] buffer = new byte[BUFFER_SIZE];

            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                stream.write(buffer, 0, count);
            }

            byte[] bytesOut = stream.toByteArray();
            inflater.end();

            return bytesOut;
        }
    }
}
