import React, { useState } from 'react';
import Modal from '../../../helpers/Modal';
import { TextField, Select, MenuItem, Button, FormControl, InputLabel, FormControlLabel, Radio } from '@mui/material';
import { toast } from 'react-toastify';
import { createTestCategory, updateTestCategory, deleteTestCategory } from '../../../utils/apiService';

const TestCategoryCreationOrUpdateModal = ({ onClose, categoryData = null, isUpdate = false, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: categoryData ? categoryData.name : '',
        language: categoryData ? categoryData.language : '',
        test_type: categoryData ? categoryData.test_type : '',
        image: null,
        is_mandatory: categoryData ? categoryData.is_mandatory : false,
        is_profile: categoryData ? categoryData.is_profile : false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            image: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.is_mandatory && !formData.is_profile) {
            toast.error("Пожалуйста, выберите тип предмета (Обязательный или Профильный).");
            return;
        }

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('language', formData.language);
            data.append('test_type', formData.test_type);
            data.append('is_mandatory', formData.is_mandatory);
            data.append('is_profile', formData.is_profile);
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (isUpdate && categoryData) {
                await updateTestCategory(categoryData.id, data);
                toast.success('Категория успешно обновлена!');
            } else {
                await createTestCategory(data);
                toast.success('Категория успешно создана!');
            }

            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error('Не удалось создать категорию.');
        }
    };

    const handleDelete = async () => {
        if (!categoryData) return;

        try {
            await deleteTestCategory(categoryData.id);
            toast.success('Категория успешно удалена!');
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            toast.error('Не удалось удалить категорию.');
        }
    };

    return (
        <Modal onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <div>
                    <TextField
                        id="name"
                        name="name"
                        label="Название категории"
                        variant="outlined"
                        fullWidth
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ marginTop: '16px' }}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel id="language-label">Язык</InputLabel>
                        <Select
                            id="language"
                            name="language"
                            label="Язык"
                            value={formData.language}
                            onChange={handleChange}
                        >
                            <MenuItem value="kz">Казахский</MenuItem>
                            <MenuItem value="ru">Русский</MenuItem>
                            <MenuItem value="en">Английский</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <FormControl fullWidth variant="outlined" required>
                        <InputLabel id="test_type-label">Тип теста</InputLabel>
                        <Select
                            id="test_type"
                            name="test_type"
                            label="Тип теста"
                            value={formData.test_type}
                            onChange={handleChange}
                        >
                            <MenuItem value="modo">MODO</MenuItem>
                            <MenuItem value="ent">ENT</MenuItem>
                            <MenuItem value="diagnostic">Diagnostic</MenuItem>
                            <MenuItem value="pisa">PISA</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <TextField
                        id="image"
                        name="image"
                        label="Загрузить картинку"
                        type="file"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            accept: 'image/jpeg, image/png, image/gif, image/webp',
                        }}
                        onChange={handleFileChange}
                    />
                </div>
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column' }}>
                    <FormControl component="fieldset">
                        <InputLabel>Выберите один</InputLabel>
                        <div>
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formData.is_mandatory}
                                        onChange={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                is_mandatory: true,
                                                is_profile: false,
                                            }))
                                        }
                                        name="is_mandatory"
                                        color="primary"
                                    />
                                }
                                label="Обязательный предмет"
                            />
                            <FormControlLabel
                                control={
                                    <Radio
                                        checked={formData.is_profile}
                                        onChange={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                is_profile: true,
                                                is_mandatory: false,
                                            }))
                                        }
                                        name="is_profile"
                                        color="primary"
                                    />
                                }
                                label="Профильный предмет"
                            />
                        </div>
                    </FormControl>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {isUpdate ? 'Обновить категорию' : 'Создать категорию'}
                    </Button>
                    {isUpdate && (
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            style={{ marginTop: '8px' }}
                            onClick={handleDelete}
                        >
                            Удалить категорию
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default TestCategoryCreationOrUpdateModal;