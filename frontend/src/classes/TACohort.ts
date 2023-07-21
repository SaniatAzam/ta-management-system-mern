export interface TACohort {
  course_id: string;
  uuid: string,
  term_year: string,
  ta_name: string,
  student_ID: Number,
  legal_name: String,
  email: String,
  degree: String,
  supervisor_name: String,
  priority: Boolean,
  hours: Number,
  date_applied: Date,
  location?: string,
  phone: string,
  courses_applied_for_list: [string],
  open_to_other_courses: Boolean,
  notes?: string,
  in_wish_list: string, //*Only Supplements AssignTA for admin
  courseNum: string //*Only Supplements AssignTA for admin
}