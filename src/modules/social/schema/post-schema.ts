import * as yup from 'yup'
export const postSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Nhập tiêu đề bài viết.')
    .max(120, 'Tiêu đề tối đa 120 ký tự.'),
  content: yup
    .string()
    .trim()
    .required('Nhập nội dung bài viết.')
    .max(2000, 'Nội dung tối đa 2.000 ký tự.'),
  published: yup
    .boolean()
    .typeError('Chọn trạng thái xuất bản.')
    .defined('Chọn trạng thái xuất bản.'),
})
